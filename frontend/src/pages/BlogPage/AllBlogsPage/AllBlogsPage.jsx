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

const DUMMY_BLOGS = [
  {
    id: '1',
    title: "The Future of AI in Education",
    author: "Dr. Aranya Sharma",
    createdAt: "2024-05-01T10:00:00Z",
    content: "Artificial Intelligence is no longer a distant dream; it's here, and it's transforming how we learn. From personalized tutoring to automated grading, AI is making education more accessible and efficient...",
    owner_id: 1
  },
  {
    id: '2',
    title: "Mastering Modern Web Development",
    author: "Sujeet Pandey",
    createdAt: "2024-04-28T14:30:00Z",
    content: "Modern web development is fast-paced. With frameworks like React and Next.js, building scalable applications has never been easier...",
    owner_id: 2
  },
  {
    id: '3',
    title: "Introduction to Quantum Computing",
    author: "Prof. Vikram Seth",
    createdAt: "2024-04-20T09:15:00Z",
    content: "Quantum computing represents a paradigm shift in how we process information. By leveraging the principles of quantum mechanics, we can solve problems that are currently impossible for classical computers...",
    owner_id: 3
  },
  {
    id: '4',
    title: "The Art of UX Design",
    author: "Priya Das",
    createdAt: "2024-04-15T11:45:00Z",
    content: "User experience is at the heart of every successful product. Understanding the user's journey and pain points is crucial for creating intuitive designs...",
    owner_id: 4
  },
  {
    id: '5',
    title: "Blockchain Beyond Cryptocurrency",
    author: "Dr. Aranya Sharma",
    createdAt: "2024-04-10T16:20:00Z",
    content: "While Bitcoin made blockchain famous, the technology has far-reaching implications for supply chain, healthcare, and digital identity...",
    owner_id: 1
  }
];

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

  // Fetch blogs based on isUserPage prop (using dummy data)
  useEffect(() => {
    const fetchBlogs = () => {
      setError(null);
      setLoading(true);

      // Simulate network delay
      setTimeout(() => {
        let data = [...DUMMY_BLOGS];
        
        if (isUserPage) {
          // Filter for dummy user (Dr. Aranya Sharma / owner_id 1)
          data = data.filter(blog => blog.owner_id === 1);
        }

        setBlogs(data);
        setLoading(false);
      }, 800);
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