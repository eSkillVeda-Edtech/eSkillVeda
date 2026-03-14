import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Sun, Moon, Menu, X, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ toggleTheme, theme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { label: 'Home', url: '/' },
    { label: 'Courses', url: '/courses' },
    { label: 'AI Tools', url: '/ai-tools' },
    { label: 'Blogs', url: '/blogs' },
    { label: 'Contact', url: '/contact' }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = (url) => {
    setMobileMenuOpen(false);
    navigate(url);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo with eSkillVeda title - Changed from <Link> to <div> */}
      <div className="navbar-brand">
        <div className="flex items-center gap-2 text-xl sm:text-2xl lg:text-3xl font-semibold select-text">
          {/* Logo Image from public folder */}
          <img 
            src="/logo.png" 
            alt="eSkillVeda Logo" 
            className="h-6 w-6 sm:h-6 sm:w-6 lg:h-8 lg:w-8 object-contain"
          />
          {/* Title Text */}
          <div className="flex items-center">
            <span className="font-aligarh italic text-es-yellow leading-tight">e</span>
            <span  className="font-platoon leading-tight uppercase" style={{ color: theme === 'dark' ? '#ffffff' : '#0c53a0' }} >SkillVeda</span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="desktop-nav">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.url} className="nav-link">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="navbar-actions">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Desktop Auth - Modified */}
        <div className="desktop-auth">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="profile-icon-btn"
              title={`Go to Dashboard (${user?.name || user?.email})`}
            >
              <User size={20} />
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} className="login-btn">
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button - Only hamburger menu */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-btn"
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {/* Mobile Navigation Links */}
        <div className="mobile-nav-links">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleMobileNavClick(link.url)}
              className="mobile-nav-link"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Auth - Side by Side Layout */}
        <div className="mobile-auth">
          {isAuthenticated && (
            <div className="mobile-user-info">
              <User size={16} />
              <span>{user?.name || user?.email}</span>
            </div>
          )}
          
          <div className="mobile-auth-buttons">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleMobileNavClick('/dashboard')}
                  className="mobile-dashboard-btn"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleMobileNavClick('/auth')}
                className="mobile-login-btn"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;