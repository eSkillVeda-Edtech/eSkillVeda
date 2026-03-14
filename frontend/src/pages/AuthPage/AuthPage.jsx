import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { useAuth } from '../../contexts/AuthContext.jsx';
import '../../styles/index.css';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft, FaFacebook, FaXTwitter } from 'react-icons/fa6';


const AuthPage = () => {
  // --- State Hooks ---
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI/Feedback states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // --- Hooks ---
  const { isAuthenticated, login, signup } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // --- Handlers ---
  const resetState = () => {
    setError('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };
  
  const handleSignUpClick = () => {
    resetState();
    setIsSignUpActive(true);
  };
  
  const handleLoginClick = () => {
    resetState();
    setIsSignUpActive(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (isSignUpActive && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUpActive) {
        await signup({ name, email, password });
        setSuccessMessage('Signup successful! Redirecting...');
      } else {
        await login({ email, password });
        setSuccessMessage('Login successful! Redirecting...');
      }
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'An error occurred.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  
  if (isAuthenticated) return null;

  // MODIFIED: Removed 'href' property as these are now for display only
  const socialLinks = [
    { Icon: FaGithub, name: 'GitHub' },
    { Icon: FaLinkedin, name: 'LinkedIn' },
    { Icon: FaGoogle, name: 'Google' },
    { Icon: FaMicrosoft, name: 'Microsoft' },
    { Icon: FaFacebook, name: 'Facebook' },
    { Icon: FaXTwitter, name: 'X (Twitter)' }
  ];

  
  return (
    <div className={`authpage-container ${isSignUpActive ? 'sign-up-mode' : ''}`}>
      <div className="authpage-forms-container">
        <div className="authpage-signin-signup">
          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="authpage-sign-in-form">
            <h2 className="authpage-auth-title">Login</h2>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="input-field auth-input"
              autoComplete="username"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="input-field auth-input"
              autoComplete="current-password"
            />
            
            {error && <div className="authpage-auth-error">{error}</div>}
            {successMessage && <div className="authpage-auth-success">{successMessage}</div>}
            
            <button type="submit" className="authpage-auth-btn" disabled={loading}>
              {loading ? <div className="authpage-spinner"></div> : 'Login'}
            </button>
            
            <div className="social-login-section">
              <div className="social-login-text">Or Login with:</div>
              <div className="social-login-icons">
                {socialLinks.map((link, index) => (
                  // MODIFIED: Changed from <a> to <div> and added disabled class
                  <div
                    key={index}
                    className="social-login-link disabled"
                    aria-label={link.name}
                    title={`${link.name} login coming soon`}
                  >
                    <link.Icon size={24} />
                  </div>
                ))}
              </div>
            </div>

          </form>
          
          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="authpage-sign-up-form">
            <h2 className="authpage-auth-title">Sign Up</h2>
            
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="input-field auth-input"
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="input-field auth-input"
              autoComplete="username"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="input-field auth-input"
              autoComplete="new-password"
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="input-field auth-input"
              autoComplete="new-password"
            />
            
            {error && <div className="authpage-auth-error">{error}</div>}
            {successMessage && <div className="authpage-auth-success">{successMessage}</div>}
            
            <button type="submit" className="authpage-auth-btn" disabled={loading}>
              {loading ? <div className="authpage-spinner"></div> : 'Sign Up'}
            </button>
            
            <div className="social-login-section">
              <div className="social-login-text">Or Signup with:</div>
              <div className="social-login-icons">
                {socialLinks.map((link, index) => (
                   // MODIFIED: Changed from <a> to <div> and added disabled class
                  <div
                    key={index}
                    className="social-login-link disabled"
                    aria-label={link.name}
                    title={`${link.name} login coming soon`}
                  >
                    <link.Icon size={24} />
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>
      </div>

      <div className="authpage-panels-container">
        <div className="authpage-panel authpage-left-panel">
          <div className="authpage-content">
            <h2>New here?</h2>
            <p>Join us today to Explore our AI Powered Platform</p>
            <button className="authpage-auth-btn authpage-transparent" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
        <div className="authpage-panel authpage-right-panel">
          <div className="authpage-content">
            <h2>One of Us?</h2>
            <p>Login to Access Your Dashboard & Our Tools</p>
            <button className="authpage-auth-btn authpage-transparent" onClick={handleLoginClick}>
               Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
