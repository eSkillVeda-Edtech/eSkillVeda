import React from 'react';
// Remove Router import from here, but keep the others
import { Route, Routes, useLocation } from 'react-router-dom'; 
import ScrollToTop from './components/ScrolltoTop';
import { useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import RequireAuth from './components/auth/RequireAuth';


// Page Imports
import Home from './pages/HomePage/HomePage';
import Dashboard from './pages/Dashboard/Dashboard';
import Courses from './pages/Courses/Courses';
import AuthPage from './pages/AuthPage/AuthPage';
import ResumeHomePage from './pages/AI-Tool/AI-Resume-Builder/ResumeHomePage/ResumeHomePage';
import { ResumeProvider } from './pages/AI-Tool/AI-Resume-Builder/context/ResumeContext';
import ProtectedResumeBuilder from './pages/AI-Tool/AI-Resume-Builder/components/ProtectedResumeBuilder';
import AI_ToolsPage from './pages/AI-Tool/AI_ToolsPage/AI_ToolsPage';
import AllBlogsPage from './pages/BlogPage/AllBlogsPage/AllBlogsPage';
import BlogViewPage from './pages/BlogPage/BlogViewPage/BlogViewPage';
import CreateBlogPage from './pages/BlogPage/CreateBlogPage/CreateBlogPage';
import CombinedSections from './pages/HomePage/components/CombinedSections';
import ContactPage from './pages/ContactPage/ContactPage'; // Import the new component
import './styles/index.css';


function App() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const noFooterPaths = ['/auth', '/dashboard', '/resume-builder'];

  const shouldShowFooter = !noFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <div 
      className={`app ${theme}`} 
      data-theme={theme}
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        margin: 0,
        padding: 0
      }}
    >
      <ScrollToTop />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main 
        className="main-content"
        style={{ 
          flex: '1 0 auto',
          margin: 0,
          padding: 0
        }}
      >
        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

          {/* Resume Builder Routes */}
          <Route path="/resume-homepage" element={<RequireAuth><ResumeProvider><ResumeHomePage /></ResumeProvider></RequireAuth>} />
          <Route path="/resume-builder" element={<RequireAuth><ResumeProvider><ProtectedResumeBuilder /></ResumeProvider></RequireAuth>} />

          {/* AI Tools */}
          <Route path="/ai-tools" element={<AI_ToolsPage />} />


          {/* Blog Pages */}
          <Route path="/blogs" element={<AllBlogsPage isUserPage={false} />} />
          <Route path="/user/blogs" element={<AllBlogsPage isUserPage={true} />} />
          <Route path="/blogs/create" element={<RequireAuth><CreateBlogPage /></RequireAuth>} />
          <Route path="/blogs/edit/:id" element={<RequireAuth><CreateBlogPage /></RequireAuth>} />
          <Route path="/blogs/:id" element={<BlogViewPage />} />


          {/* Additional Routes */}
          <Route path="/features" element={<CombinedSections />} />
          <Route path="/community" element={<CombinedSections />} />
          <Route path="/tools" element={<AI_ToolsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      {shouldShowFooter && <Footer theme={theme} />}
    </div>
  );
}


export default App;
