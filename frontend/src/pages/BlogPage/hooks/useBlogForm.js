// hooks/useBlogForm.js

import { useState } from 'react';
import toast from 'react-hot-toast';

export const useBlogForm = ({ onSuccess, isEditMode = false, blogId = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to decode JWT token and get user data
  const getCurrentUser = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get the current user from JWT token
    const currentUser = getCurrentUser();

    // Create request body with optional owner_id
    const requestBody = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: formData.author.trim()
    };

    // Only add owner_id if user is authenticated and has an id (for create mode)
    if (!isEditMode && currentUser && currentUser.id) {
      requestBody.owner_id = currentUser.id;
    }

    setLoading(true);
    const toastId = toast.loading(isEditMode ? 'Updating blog...' : 'Publishing blog...');

    try {
      const url = isEditMode
        ? `http://127.0.0.1:8001/api/blogs/${blogId}`
        : 'http://127.0.0.1:8001/api/blogs/';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const blog = await response.json();
      toast.success(isEditMode ? 'Blog updated successfully!' : 'Blog published successfully!', { id: toastId });

      if (onSuccess) {
        onSuccess(blog);
      }

      // Reset form only for create mode
      if (!isEditMode) {
        setFormData({
          title: '',
          content: '',
          author: ''
        });
      }

    } catch (error) {
      console.error('Error with blog:', error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'publish'} blog`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // FINAL RETURN OBJECT
  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    setFormData, // Make absolutely sure this is returned!
  };
};
