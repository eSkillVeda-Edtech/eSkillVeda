import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Code2,
  Briefcase,
  TrendingUp,
  FileText,
  Mic,
  GitFork,
  BookOpen
} from 'lucide-react';
import LottieAnimation from './ui/LottieAnimation.jsx';
import robotAnimation from './ui/RobotSaludando.json';

// --- Carousel Data (No changes here) ---
const heroCarouselItems = [
    {
        type: 'Course',
        title: 'React Development',
        icon: <Code2 size={40} />,
        highlights: ['React', 'Hooks', 'Context API'],
        path: '/courses/react',
        status: 'Active'
    },
    {
        type: 'Tool',
        title: 'AI Resume Builder',
        icon: <FileText size={40} />,
        highlights: ['ATS-Friendly', 'AI Suggestions'],
        path: '/resume-homepage',
        status: 'Active'
    },
    {
        type: 'Course',
        title: 'Business Strategy',
        icon: <Briefcase size={40} />,
        highlights: ['Market Analysis', 'SWOT'],
        path: '/courses/business',
        status: 'Active'
    },
    {
        type: 'Course',
        title: 'Career Development',
        icon: <TrendingUp size={40} />,
        highlights: ['Career Growth', 'Soft Skills'],
        path: '/courses/career',
        status: 'Coming Soon'
    },
    {
        type: 'Course',
        title: 'UI/UX Design',
        icon: <BookOpen size={40} />,
        highlights: ['Design Thinking', 'Prototyping'],
        path: '/courses/design',
        status: 'Active'
    },
    {
        type: 'Tool',
        title: 'AI Mock Interview',
        icon: <Mic size={40} />,
        highlights: ['Real-time Feedback', 'Analytics'],
        path: '#',
        status: 'Coming Soon'
    },
    {
        type: 'Tool',
        title: 'DiagramGPT',
        icon: <GitFork size={40} />,
        highlights: ['Text-to-Diagram', 'Flowcharts'],
        path: '#',
        status: 'Coming Soon'
    }
];


// --- START: Updated Hero Carousel Component (Now using CSS classes) ---
const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const slideIntervalRef = useRef(null);
    const totalItems = heroCarouselItems.length;

    const resetInterval = useCallback(() => {
        if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
        }, 4000);
    }, [totalItems]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
        resetInterval();
    }, [totalItems, resetInterval]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
        resetInterval();
    }, [totalItems, resetInterval]);

    useEffect(() => {
        resetInterval();
        return () => clearInterval(slideIntervalRef.current);
    }, [resetInterval]);

    const getCardStyle = (index) => {
        const offset = (index - currentIndex + totalItems) % totalItems;
        const isCenter = offset === 0;
        const isLeft = offset === totalItems - 1;
        const isRight = offset === 1;

        let transform = 'translate(-50%, -50%) ';
        let opacity = 0;
        let zIndex = 0;
        let filter = 'blur(3px)';

        if (isCenter) {
            transform += 'translateX(0) translateZ(80px) scale(1)';
            opacity = 1;
            zIndex = totalItems;
            filter = 'blur(0px)';
        } else if (isLeft) {
            transform += 'translateX(-380px) translateZ(-150px) rotateY(15deg) scale(0.8)';
            opacity = 0.4;
            zIndex = totalItems - 1;
        } else if (isRight) {
            transform += 'translateX(380px) translateZ(-150px) rotateY(-15deg) scale(0.8)';
            opacity = 0.4;
            zIndex = totalItems - 1;
        } else {
            transform += `translateX(${offset < totalItems / 2 ? -500 : 500}px) translateZ(-400px) scale(0.5)`;
            opacity = 0;
        }
        return { transform, opacity, zIndex, filter };
    };
    
    return (
        <div className="hero-carousel-wrapper">
            <div className="hero-carousel-container">
                <button className="hero-carousel-nav-button left" onClick={prevSlide}>
                    <ChevronLeft size={24} />
                </button>
                <div className="hero-carousel-track">
                    {heroCarouselItems.map((item, index) => {
                        const isCenter = index === currentIndex;
                        const isDisabled = item.status === 'Coming Soon';
                        const buttonText = item.type === 'Course' ? 'Enroll' : 'Use Tool';

                        return (
                            <div
                                key={item.title}
                                className="hero-carousel-card"
                                style={getCardStyle(index)}
                                onClick={() => {
                                    if (!isCenter) {
                                        setCurrentIndex(index);
                                        resetInterval();
                                    }
                                }}
                            >
                                <div className="hero-carousel-card-top-content">
                                    <div className="hero-carousel-card-icon">{item.icon}</div>
                                    <div className="hero-carousel-card-details">
                                        <h3 className="hero-carousel-card-title">{item.title}</h3>
                                        <div className="hero-carousel-card-highlights">
                                            {item.highlights.map(highlight => (
                                                <span key={highlight} className="hero-carousel-card-highlight-item">{highlight}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    disabled={isDisabled}
                                    className="hero-carousel-card-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isDisabled) return;

                                        if (isCenter) {
                                            if (item.path !== '#') navigate(item.path);
                                        } else {
                                            setCurrentIndex(index);
                                            resetInterval();
                                        }
                                    }}
                                >
                                    {isDisabled ? 'Coming Soon' : buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button className="hero-carousel-nav-button right" onClick={nextSlide}>
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};
// --- END: Updated Hero Carousel Component ---


// --- START: Updated Hero Section Component ---
const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };


  return (
    <section className="hero-section">
      {/* Container for the top part: Text and Robot */}
      <div className="hero-content-container">
        <div className="hero-text">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Learning Platform</span>
          </div>
          
          <h1>Bridge Your Learning to Career Excellence</h1>
          
          <p className="subtitle">
            Transform your potential into expertise with personalized AI mentorship, 
            industry-aligned learning paths, and career acceleration tools.
          </p>

          <div className="hero-cta-group">
            <button className="cta-button primary-cta" onClick={handleClick}>
              {isAuthenticated ? 'Go to Dashboard' : 'Start Learning Journey'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          {/* The robot animation now lives alone here */}
          <LottieAnimation 
              animationData={robotAnimation} 
              className="robot-animation"
          />
        </div>
      </div>
      
      {/* New Headline */}
      <h2 className="section-subtitle-heading">Our AI Tools & Courses</h2>

      {/* The carousel is now here, outside and below the main content */}
      <HeroCarousel />

    </section>
  );
};
// --- END: Updated Hero Section Component ---

export default HeroSection;