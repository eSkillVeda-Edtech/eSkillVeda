import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Edit, Trash2, MoreVertical, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import toast, { Toaster } from 'react-hot-toast';
import './BlogViewPage.css';

// Function to get current user from JWT token
const getCurrentUser = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// --- MODAL COMPONENT ---

// Confirmation Modal for Deletion
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary" disabled={isDeleting}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-destructive" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN BLOG VIEW PAGE ---
const BlogViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for modals and menus
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isActionsMenuOpen, setActionsMenuOpen] = useState(false);

  const currentUser = getCurrentUser();

  const isOwner = useMemo(() => {
    if (!blog || !currentUser) return false;
    return blog.owner_id && blog.owner_id === currentUser.id;
  }, [blog, currentUser]);

  const sanitizedHtml = useMemo(() => {
    if (!blog?.content) return null;
    return DOMPurify.sanitize(blog.content);
  }, [blog]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://127.0.0.1:8001/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Blog not found' : 'Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);
  
  // Effect to add 'copy code' buttons to code blocks
  useEffect(() => {
    if (loading || !blog) return;
    document.querySelectorAll('.blog-body pre').forEach(block => {
      if (block.querySelector('.copy-code-btn')) return;
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      block.appendChild(button);
      button.addEventListener('click', () => {
        const code = block.querySelector('code')?.innerText || '';
        navigator.clipboard.writeText(code)
          .then(() => toast.success('Code copied!', { duration: 2000 }))
          .catch(() => toast.error('Failed to copy code.'));
      });
    });
  }, [blog, loading]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const estimateReadTime = (content) => {
    if (!content) return '1 min read';
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  const handleDeleteConfirm = async () => {
    if (!blog || !isOwner) return;
    setIsDeleting(true);
    const toastId = toast.loading('Deleting blog...');
    try {
      const response = await fetch(`http://127.0.0.1:8001/api/blogs/${blog.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete blog');
      toast.success('Blog deleted successfully!', { id: toastId });
      navigate('/blogs');
    } catch (err) {
      toast.error('Failed to delete blog.', { id: toastId });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="blog-view-page loading">Loading...</div>;
  }

  if (error || !blog) {
    return <div className="blog-view-page error"><h2>{error || 'Blog not found'}</h2></div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      
      <div className="blog-view-page">
        <article className="blog-content">
          <header className="blog-header">
            <div className="blog-header-content">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-meta">
                    <span><User size={14} /> By {blog.author}</span>
                    <span><Calendar size={14} /> {formatDate(blog.createdAt)}</span>
                    <span><Clock size={14} /> {estimateReadTime(blog.content)}</span>
                </div>
            </div>
            
            {isOwner && (
              <div className={`blog-actions-menu ${isActionsMenuOpen ? 'is-open' : ''}`}>
                <div className="slide-in-actions">
                  <button
                    onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                    className="action-icon-btn edit-btn"
                    aria-label="Edit Blog"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setActionsMenuOpen(false);
                    }}
                    className="action-icon-btn delete-btn"
                    aria-label="Delete Blog"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <button
                  onClick={() => setActionsMenuOpen(!isActionsMenuOpen)}
                  className="actions-menu-button"
                  aria-label="Toggle Actions Menu"
                >
                  {isActionsMenuOpen ? <X size={22} /> : <MoreVertical size={22} />}
                </button>
              </div>
            )}
          </header>

          <div className="blog-body">
            {/<\w+[^>]*>/.test(blog.content) ? (
              <div className="blog-html-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            ) : (
              <div className="blog-markdown-content">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogViewPage;