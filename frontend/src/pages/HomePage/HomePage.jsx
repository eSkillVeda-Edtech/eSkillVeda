import React from 'react';
import HeroSection from './components/HeroSection';
import CombinedSections from './components/CombinedSections';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* The decorative background shapes */}
      <div className="homepage-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <main>
        <HeroSection />
        <CombinedSections />
      </main>
    </div>
  );
};

export default HomePage;