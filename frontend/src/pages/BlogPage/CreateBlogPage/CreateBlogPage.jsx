import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Sparkles, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useBlogForm } from '../hooks/useBlogForm';
import BlogEditor from './BlogEditor/BlogEditor';
import toast, { Toaster } from 'react-hot-toast';
import './CreateBlogPage.css';
import Pagination from '../../../components/Pagination/Pagination';

// --- Global Theme Listener Hook ---
const useGlobalTheme = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setTheme(mutation.target.getAttribute('data-theme') || 'light');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return theme;
};

// Helper function to get current user from localStorage
function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

const CreateBlogPage = () => {
  const theme = useGlobalTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarCurrentPage, setSidebarCurrentPage] = useState(1);
  const sidebarItemsPerPage = 3;
  const listRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Scroll main window to top on initial load or when editing a new blog
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    setIsEditMode(!!id);
  }, [id]);

  const handleSuccess = () => {
    const message = isEditMode ? 'Blog updated successfully!' : 'Blog published successfully!';
    const state = isEditMode ? { justUpdated: true } : { justPublished: true };
    toast.success(message);
    navigate('/user/blogs', { state });
  };

  const { formData, loading: formLoading, handleInputChange, handleSubmit, setFormData } = useBlogForm({
    onSuccess: handleSuccess,
    isEditMode,
    blogId: id
  });

  const handleBackNavigation = () => {
    if (isEditMode) {
      navigate('/user/blogs');
    } else {
      navigate('/blogs');
    }
  };

  useEffect(() => {
    if (isEditMode && id) {
      const fetchBlogForEdit = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://127.0.0.1:8001/api/blogs/${id}`);
          if (response.ok) {
            const blog = await response.json();
            setFormData({ title: blog.title, content: blog.content, author: blog.author });
          } else {
            toast.error('Failed to load blog for editing');
            navigate('/blogs');
          }
        } catch (error) {
          console.error('Error fetching blog for edit:', error);
          toast.error('Failed to load blog for editing');
          navigate('/blogs');
        } finally {
          setLoading(false);
        }
      };
      fetchBlogForEdit();
    }
  }, [isEditMode, id, navigate, setFormData]);

  useEffect(() => {
    if (!isEditMode) {
      const currentUser = getCurrentUser();
      if (currentUser?.name) {
        setFormData(prevData => ({ ...prevData, author: currentUser.name }));
      }
    }
  }, [isEditMode, setFormData]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser?.id) { 
        setBlogsLoading(false);
        return;
      }

      setBlogsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8001/api/blogs/user/${currentUser.id}`);
        
        if (response.ok) {
          const myBlogs = await response.json();
          const sortedBlogs = myBlogs.sort((a, b) => {
            const dateA = new Date(String(a.created_at).replace(' ', 'T'));
            const dateB = new Date(String(b.created_at).replace(' ', 'T'));
            if (isNaN(dateA.getTime())) return 1;
            if (isNaN(dateB.getTime())) return -1;
            return dateB - dateA;
          });
          setUserBlogs(sortedBlogs);
        } else if (response.status === 404) {
          setUserBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);
  
  // Scroll sidebar list to top on its own page change
  useEffect(() => {
    if(listRef.current) {
        listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [sidebarCurrentPage]);

  const sidebarTotalPages = useMemo(() => {
    return Math.ceil(userBlogs.length / sidebarItemsPerPage);
  }, [userBlogs.length]);

  const paginatedUserBlogs = useMemo(() => {
    const startIndex = (sidebarCurrentPage - 1) * sidebarItemsPerPage;
    return userBlogs.slice(startIndex, startIndex + sidebarItemsPerPage);
  }, [userBlogs, sidebarCurrentPage]);

  const handleEditNavigation = (blogIdToEdit) => {
    navigate(`/blogs/edit/${blogIdToEdit}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;

    setIsDeleting(true);
    const toastId = toast.loading('Deleting blog...');
    try {
      const response = await fetch(`http://127.0.0.1:8001/api/blogs/${id}`, { method: 'DELETE' });

      if (response.ok) {
        toast.success('Blog deleted successfully!', { id: toastId });
        navigate('/user/blogs', { state: { justDeleted: true } });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete the blog.');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };
  
    const handleDeleteFromSidebar = async (blogIdToDelete, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this blog?')) {
            const toastId = toast.loading('Deleting...');
            try {
                const response = await fetch(`http://127.0.0.1:8001/api/blogs/${blogIdToDelete}`, { method: 'DELETE' });
                if (response.ok) {
                    toast.success('Blog deleted.', { id: toastId });
                    setUserBlogs(currentBlogs => currentBlogs.filter(b => b.id !== blogIdToDelete));
                } else {
                    throw new Error('Failed to delete blog.');
                }
            } catch (error) {
                console.error('Error deleting blog from sidebar:', error);
                toast.error('Could not delete blog.', { id: toastId });
            }
        }
    };

    const isEditorEmpty = (htmlContent) => {
        if (!htmlContent) return true;
        const temp = document.createElement('div');
        temp.innerHTML = htmlContent;
        return (temp.textContent || temp.innerText).trim() === '';
    };

    const isFormValid = useMemo(() => {
        return formData.title.trim() && formData.author.trim() && !isEditorEmpty(formData.content) && !loading;
    }, [formData.title, formData.author, formData.content, loading]);
    
    const handleGenerateAI = async () => {
        if (isEditorEmpty(formData.content) && !formData.title.trim()) {
            toast.error("Please provide a title or some content to generate a blog post.");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading('Generating content with AI...');
        try {
            const response = await fetch('http://127.0.0.1:8001/api/blogs/generateWithAI', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: formData.title, content: formData.content || null })
            });
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const result = await response.json();
            if (result.generated_blog) {
                handleInputChange({ target: { name: 'content', value: result.generated_blog } });
                toast.success('Content generated successfully!', { id: toastId });
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (aiError) {
            console.error("AI Generation Error:", aiError);
            toast.error('Failed to generate content. Please try again.', { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const getPreview = (content, maxLength = 100) => {
        if (!content) return '';
        const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    
    return (
        <div className="create-blog-page" data-theme={theme}>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: theme === 'dark' ? '#374151' : '#ffffff',
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                },
            }}/>
            <div className="create-blog-left-column">
                <div className="create-blog-header">
                    <h1 className="create-blog-title">{isEditMode ? 'Edit Blog' : 'Create Blog'}</h1>
                    <p className="create-blog-subtitle">
                        {isEditMode ? 'Refine your story and update your post.' : 'Craft a new story for your audience.'}
                    </p>
                </div>

                <div className="create-blog-controls-row">
                    <button onClick={handleSubmit} disabled={!isFormValid || formLoading || isDeleting} className="small publish-btn">
                        <Save size={16} />
                        {formLoading ? (isEditMode ? '...' : '...') : (isEditMode ? 'Update' : 'Publish')}
                    </button>
                    <button onClick={handleGenerateAI} disabled={isGenerating} className="small ai-generate-btn">
                         <Sparkles size={18} />
                        {isGenerating ? '...' : 'Gen AI'}
                    </button>
                    {isEditMode && (
                        <button onClick={handleDelete} disabled={isDeleting} className="small delete-btn">
                            <Trash2 size={16} />
                            {isDeleting ? '...' : 'Delete'}
                        </button>
                    )}
                </div>

                <div className="user-blogs-section">
                    <h3 className="section-title">Your Blogs</h3>
                    {blogsLoading ? (
                        <div className="blogs-loading">
                            {[...Array(3)].map((_, i) => <div key={i} className="blog-item-skeleton" />)}
                        </div>
                    ) : userBlogs.length > 0 ? (
                        <>
                            <div className="user-blogs-list" ref={listRef}>
                                {paginatedUserBlogs.map(blog => (
                                    <div key={blog.id} className="user-blog-item" onClick={() => handleEditNavigation(blog.id)}>
                                        <div className="blog-item-content">
                                            <h4 className="blog-item-title">{blog.title}</h4>
                                            <p className="blog-item-preview">{getPreview(blog.content)}</p>
                                        </div>
                                        <div className="blog-item-actions">
                                            <button className="edit-blog-btn" onClick={(e) => { e.stopPropagation(); handleEditNavigation(blog.id); }}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="delete-blog-btn" onClick={(e) => handleDeleteFromSidebar(blog.id, e)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {sidebarTotalPages > 1 && (
                                <div className="sidebar-pagination-wrapper">
                                    <Pagination
                                        currentPage={sidebarCurrentPage}
                                        setPage={setSidebarCurrentPage}
                                        totalPages={sidebarTotalPages}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="no-blogs">No blogs yet. Create your first one!</p>
                    )}
                </div>
            </div>

            <div className="create-blog-right-column">
                <div className="back-navigation">
                    <button className="back-btn" onClick={handleBackNavigation}>
                        <ArrowLeft size={16} />
                        {isEditMode ? 'My Blogs' : 'Blog Feed'}
                    </button>
                </div>
                {(loading && isEditMode) ? (
                    <div className="form-skeleton">
                        <div className="skeleton-input" style={{ height: '4rem', marginBottom: '1rem' }}></div>
                        <div className="skeleton-input" style={{ height: '2rem', marginBottom: '2rem' }}></div>
                        <div className="skeleton-editor"></div>
                    </div>
                ) : (
                    <form className="blog-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="title"
                                className="blog-title-input"
                                placeholder="Blog Title..."
                                value={formData.title}
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="author"
                                className="blog-author-input"
                                placeholder="Author Name"
                                value={formData.author}
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <BlogEditor
                                value={formData.content}
                                onChange={(content) => handleInputChange({ target: { name: 'content', value: content } })}
                                placeholder="Start writing your amazing blog post here..."
                                theme={theme}
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateBlogPage;

