import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Clock, User, Edit, LayoutDashboard } from 'lucide-react';
import DOMPurify from 'dompurify';
import './AllBlogsPage.css';
import Pagination from '../../../components/Pagination/Pagination';

function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

const AllBlogsPage = ({ isUserPage = false }) => {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);

  // Reset currentPage when switching between user/general blogs
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm('');
  }, [isUserPage]);

  // Fetch blogs based on isUserPage prop
  useEffect(() => {
    const fetchBlogs = async () => {
      if (isUserPage && !currentUser?.id) {
        setLoading(false);
        setError("You must be logged in to see your blogs.");
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const endpoint = isUserPage 
          ? `http://127.0.0.1:8001/api/blogs/user/${currentUser.id}`
          : 'http://127.0.0.1:8001/api/blogs/';
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          if (response.status === 404 && isUserPage) {
            setBlogs([]);
            return;
          }
          throw new Error(`Failed to fetch blogs (status: ${response.status})`);
        }
        
        const data = await response.json();
        setBlogs(data); // Removed date sorting
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [isUserPage, currentUser]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter blogs based on search term
  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  const paginatedBlogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBlogs.slice(startIndex, endIndex);
  }, [filteredBlogs, safeCurrentPage, itemsPerPage]);

  // Sync currentPage with safeCurrentPage if needed
  useEffect(() => {
    if (currentPage !== safeCurrentPage && filteredBlogs.length > 0) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage, filteredBlogs.length]);

  // Utility functions
  const estimateReadTime = (content) => {
    if (!content) return '0 min read';
    const wordCount = content.trim().split(/\s+/).length;
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  const getPreview = useMemo(() => {
    const markdownSyntaxRegex = /[#*_`>~-]|\[(.*?)\]\((.*?)\)/g;
    return (raw, maxLength = 260) => {
      if (!raw) return '';
      const looksLikeHtml = /<\w+[^>]*>/.test(raw);
      let working = raw;
      
      if (looksLikeHtml) {
        const sanitized = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
        const tmp = document.createElement('div');
        tmp.innerHTML = sanitized;
        working = tmp.textContent || tmp.innerText || '';
      } else {
        working = working.replace(markdownSyntaxRegex, ' ');
      }
      
      working = working.replace(/\s+/g, ' ').trim();
      return working.length <= maxLength ? working : working.slice(0, maxLength).trim() + '…';
    };
  }, []);

  // Navigation handlers
  const handleCreateBlog = () => {
    navigate('/blogs/create');
  };

  const handleNavigateToOtherPage = () => {
    navigate(isUserPage ? '/blogs' : '/user/blogs');
  };

  const handleBlogAction = (blogId) => {
    if (isUserPage) {
      navigate(`/blogs/edit/${blogId}`);
    } else {
      navigate(`/blogs/${blogId}`);
    }
  };

  // Page change handler for setPage prop
  const handleSetPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Render loading state
  const renderLoading = () => (
    <div className="blog-loading">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="blog-card-skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-content"></div>
          <div className="skeleton-meta"></div>
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="blog-error">
      <h3>Oops!</h3>
      <p>{error}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );

  // Render empty state
  const renderEmpty = () => {
    if (isUserPage) {
      return (
        <div className="no-blogs-container">
          <div className="no-blogs-icon">
            <Edit size={24} />
          </div>
          <h3 className="no-blogs-title">No Stories Yet</h3>
          <p className="no-blogs-description">
            Your published blogs will appear here. Ready to share your first story?
          </p>
          <button className="create-first-blog-btn" onClick={handleCreateBlog}>
            <Plus size={16} />
            Create Your First Blog
          </button>
        </div>
      );
    } else {
      return (
        <div className="blog-empty">
          <h3>No Stories Yet</h3>
          <p>Be the first to share your story.</p>
          <button className="create-first-blog-btn" onClick={handleCreateBlog}>
            <Plus size={16} />
            Create First Blog
          </button>
        </div>
      );
    }
  };

  // Render blog list
  const renderBlogList = () => {
    if (filteredBlogs.length === 0 && searchTerm) {
      return (
        <div className="blog-error">
          <h3>No Results Found</h3>
          <p>Try adjusting your search terms.</p>
        </div>
      );
    }

    return paginatedBlogs.map((blog) => (
      <div key={blog.id} className="blog-card" onClick={() => handleBlogAction(blog.id)}>
        <div className="blog-info">
          <h2 className="blog-card-title">{blog.title}</h2>
          <p className="blog-preview">{getPreview(blog.content)}</p>
          <div className="blog-meta">
            <span>
              <User size={14} />
              {blog.author}
            </span>
            <span>
              <Clock size={14} />
              {estimateReadTime(blog.content)}
            </span>
          </div>
        </div>
        {isUserPage ? (
          <button 
            className="user-blog-edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleBlogAction(blog.id);
            }}
          >
            <Edit size={16} />
            Edit
          </button>
        ) : (
          <button 
            className="blog-read-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleBlogAction(blog.id);
            }}
          >
            Read More
          </button>
        )}
      </div>
    ));
  };

  // Main render
  return (
    <div className="all-blogs-page">
      {/* Left Column - Header and Controls */}
      <div className="blog-left-column">
        <div className="blog-header">
          <h1 className="blog-title-main">{isUserPage ? 'My Blogs' : 'Blog Feed'}</h1>
          <p className="blog-subtitle">
            {isUserPage 
              ? 'See all stories published by you.' 
              : 'Discover Insights, knowledge & stories from our community'
            }
          </p>
        </div>

        <div className="blog-controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="blog-search"
              placeholder={isUserPage ? "Search your blogs..." : "Search all blogs..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="blog-feed-controls-row">
            <button 
              className="user-blogs-btn small"
              onClick={handleNavigateToOtherPage}
            >
              <LayoutDashboard size={16} />
              {isUserPage ? 'Blog Feed' : 'My Blogs'}
            </button>
            <button className="create-blog-btn small" onClick={handleCreateBlog}>
              <Plus size={16} />
              Create Blog
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Blog List */}
      <div className="blog-right-column">
        <div className="blog-list">
          {loading && renderLoading()}
          {error && renderError()}
          {!loading && !error && blogs.length === 0 && renderEmpty()}
          {!loading && !error && blogs.length > 0 && renderBlogList()}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredBlogs.length > 0 && totalPages > 1 && (
          <div className="pagination-wrapper">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              setPage={handleSetPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogsPage;