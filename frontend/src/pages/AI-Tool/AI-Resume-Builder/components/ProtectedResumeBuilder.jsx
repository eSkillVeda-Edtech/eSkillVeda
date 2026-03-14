import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ResumeBuilder from '../ResumeBuilder/ResumeBuilder';

const ProtectedResumeBuilder = () => {
  const location = useLocation();
  
  // Check if user came from homepage
  const fromHomepage = location.state?.fromHomepage;
  
  // If not from homepage, redirect to homepage
  if (!fromHomepage) {
    return <Navigate to="/resume-homepagee" replace />;
  }
  
  return <ResumeBuilder />;
};

export default ProtectedResumeBuilder;
