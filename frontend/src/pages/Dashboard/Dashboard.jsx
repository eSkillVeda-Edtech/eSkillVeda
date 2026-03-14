import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import {
  Edit3, LogOut, FileText, Mic, Code2, Database,
  Palette, Smartphone, Brain, PenTool, BarChart3,
  User, Save, X, AlertCircle, CheckCircle, Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserForm from './components/UserForm/UserForm.jsx';
import './Dashboard.css';

// User Profile Card Component
const UserProfileCard = ({ user, onEdit, onLogout, isLoading }) => (
  <div className="user-profile-card">
    <div className="profile-info-top">
      <div className="profile-icon-wrapper">
        <User size={24} />
      </div>
      <div className="profile-details">
        <h4 className="profile-name">{user?.displayName || 'Welcome Back!'}</h4>
        <p className="profile-email">{user?.email}</p>
      </div>
    </div>

    <div className="quick-actions-divider" />

    <div className="action-buttons-row">
      <button 
        className="action-btn-sm edit-btn" 
        onClick={onEdit}
        disabled={isLoading}
      >
        <Edit3 size={14} />
        EDIT
      </button>
      <button 
        className="action-btn-sm logout-btn" 
        onClick={onLogout}
        disabled={isLoading}
      >
        {isLoading ? <Loader className="spinning" size={9} /> : <LogOut size={14} />}
        LOGOUT
      </button>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ stats }) => (
  <div className="stats-card">
    <div className="stat-item">
      <span className="stat-value">{stats.courses}</span>
      <span className="stat-label">Courses</span>
    </div>
    <div className="stat-item">
      <span className="stat-value">{stats.resumes}</span>
      <span className="stat-label">Resumes</span>
    </div>
    <div className="stat-item">
      <span className="stat-value">{stats.blogs}</span>
      <span className="stat-label">Blogs</span>
    </div>
  </div>
);


const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ resumes: 0, courses: 0, tools: 0, blogs: 0 });

  const courseIcons = {
    'React Development': Code2,
    'JavaScript Mastery': Code2,
    'UI/UX Design Basics': Palette,
    'Node.js Backend Development': Database,
    'Python for Data Science': BarChart3,
    'Advanced CSS & Animations': PenTool,
    'Mobile App Development': Smartphone,
    'Machine Learning Basics': Brain
  };

  const enrolledCourses = [
    { id: 1, title: "React Development", instructor: "John Smith", progress: 75, duration: "8 hours", skills: ["React", "JavaScript", "Hooks"] },
    { id: 2, title: "JavaScript Mastery", instructor: "Jane Doe", progress: 45, duration: "12 hours", skills: ["ES6+", "Async/Await", "DOM"] },
    { id: 3, title: "UI/UX Design Basics", instructor: "Mike Johnson", progress: 90, duration: "6 hours", skills: ["Figma", "Prototyping", "User Research"] }
  ];

  useEffect(() => {
    const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
    const enrolledCoursesData = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const purchasedTools = JSON.parse(localStorage.getItem('purchasedTools') || '[]');
    const userBlogs = JSON.parse(localStorage.getItem('userBlogs') || '[]');

    setStats({
      resumes: savedResumes.length,
      courses: enrolledCoursesData.length || enrolledCourses.length,
      tools: purchasedTools.length,
      blogs: userBlogs.length
    });
  }, []);

  // Notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Profile editing functions
  const handleEditProfile = () => {
    setActiveView('editProfile');
  };

  const handleSaveProfile = async (profileData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in real app, this would be an API call)
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setActiveView('dashboard');
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setActiveView('dashboard');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/auth');
      showNotification('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      showNotification('Error logging out. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { title: 'Resume Builder', icon: FileText, onClick: () => navigate('/resume-homepage') },
    { title: 'AI Tools', icon: Brain, onClick: () => navigate('/ai-tools') },
    { title: 'Mock Interview', icon: Mic, onClick: () => navigate('/mock-interview') },
  ];

  // Notification Component
  const NotificationToast = () => {
    if (!notification) return null;
    return (
      <div className={`notification-toast ${notification.type}`}>
        {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
        <span>{notification.message}</span>
      </div>
    );
  };

  const QuickActionsPanel = () => (
    <div className="Quick-card">
      <h3 className="Quick-title">Quick Actions</h3>

      <div className="quick-actions-list">
        {quickActions.map(({ title, icon: Icon, onClick }) => (
          <div className="quick-action-row" key={title}>
            <div className="qa-left">
              <span className="qa-icon-wrap"><Icon size={16} /></span>
              <span className="quick-action-title">{title}</span>
            </div>
            <button className="quick-action-btn" onClick={onClick} disabled={isLoading}>
              {isLoading ? <Loader className="spinning" size={14} /> : 'Open'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Edit Profile View
  if (activeView === 'editProfile') { // FIX: Was 'activeViw'
    return (
      <div className="dashboard-container" data-theme={theme}>
        <NotificationToast />
        
        <div className="edit-profile-overlay">
          <div className="edit-profile-container">
            <div className="edit-profile-header">
              <div className="edit-profile-title">
                <User size={24} />
                <h2>Edit Profile</h2>
              </div>
              <button 
                className="close-edit-btn"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="edit-profile-content">
              <UserForm 
                user={user}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
                onClose={handleCancelEdit}  // Add this line
                isLoading={isLoading}
              />
            </div>

            <div className="edit-profile-actions">
              <button 
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={() => {}}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="spinning" size={16} /> : <Save size={16} />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="dashboard-container" data-theme={theme}>
      <NotificationToast />
      
      <div className="dashboard-layout">
        {/* Left column */}
        <div className="left-column">
          <div className="C-card">
            <h3 className="Course-title">My Learning Journey</h3>

            <div className="enrolled-courses-list">
              {enrolledCourses.map(course => {
                const Icon = courseIcons[course.title] || Code2;
                return (
                  <div className="enrolled-course-card" key={course.id}>
                    <div className="enrolled-course-icon"><Icon size={20} /></div>

                    <div>
                      <h4 className="enrolled-course-title">{course.title}</h4>
                      <p className="enrolled-course-details">
                        By {course.instructor} • {course.duration}
                      </p>

                      <div className="enrolled-course-skills">
                        {course.skills.map(s => (
                          <span key={s} className="skill-pill">{s}</span>
                        ))}
                      </div>

                      <div>
                        <div className="progress-header">
                          <span className="progress-text">Progress</span>
                          <span className="progress-text">{course.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <button className="continue-learning-btn">Continue</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="right-column">
          <UserProfileCard 
            user={user} 
            onEdit={handleEditProfile} 
            onLogout={handleLogout} 
            isLoading={isLoading} 
          />
          <QuickActionsPanel />
          <StatsCard stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;