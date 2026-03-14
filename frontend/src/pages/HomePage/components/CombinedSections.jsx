import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, BrainCircuit, Target, Users } from 'lucide-react';

const FeatureListItem = ({ title, description, icon, buttonText, onClick }) => (
    <div 
        className="feature-list-item" 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        }}
    >
        <div className="feature-icon-wrapper">
            {React.createElement(icon, { 
                size: window.innerWidth < 768 ? 18 : 22,
                'aria-hidden': true 
            })}
        </div>
        <div className="feature-text-content">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
        {buttonText && (
            <button 
                className="feature-action-button"
                aria-label={`${buttonText} for ${title}`}
            >
                {buttonText}
            </button>
        )}
    </div>
);

const CombinedSections = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "AI-Powered Study Tools",
            description: "Generate flashcards, quizzes, and summaries from your notes with advanced AI.",
            icon: BrainCircuit,
            buttonText: "Try AI Tools",
            onClick: () => navigate('/ai-tools'),
        },
        {
            title: "Personalized Learning Paths", 
            description: "Custom study plans that adapt to your goals, pace, and learning style.",
            icon: Target,
            buttonText: "Start Learning",
            onClick: () => navigate('/courses'),
        },
        {
            title: "Interactive Course Materials",
            description: "Dynamic content with hands-on projects and real-world applications.",
            icon: BookOpen,
            buttonText: "Explore Courses",
            onClick: () => navigate('/courses'),
        },
    ];

    const communityFeatures = [
        {
            title: "Peer-to-Peer Study Groups",
            description: "Join collaborative learning spaces and connect with like-minded students.",
            icon: Users,
            buttonText: "Join Groups",
            onClick: () => navigate('/community'),
        },
        {
            title: "Expert Q&A Forums",
            description: "Get instant answers from subject experts and experienced learners.",
            icon: MessageSquare,
            buttonText: "Ask Questions",
            onClick: () => navigate('/community'),
        },
        {
            title: "Live Tutoring Sessions",
            description: "One-on-one mentorship with certified tutors and industry professionals.",
            icon: Calendar,
            buttonText: "Book Session",
            onClick: () => navigate('/community'),
        },
    ];

    // Inline styles for headings
    const smartLearningStyle = {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: '800',
        textAlign: 'center',
        marginTop: '1rem',
        margin: '1rem 0 clamp(2rem, 4vw, 3rem) 0',
        padding: '0',
        background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #f59e0b 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))',
        color: '#6366f1',
        letterSpacing: '-0.025em',
        lineHeight: '1.1',
        display: 'block',
        position: 'relative',
        zIndex: '10'
    };

    const vibrantCommunityStyle = {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: '800',
        textAlign: 'center',
        marginTop: '1rem',
        margin: '1rem 0 clamp(2rem, 4vw, 3rem) 0',
        padding: '0',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #f59e0b 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.3))',
        color: '#3b82f6',
        letterSpacing: '-0.025em',
        lineHeight: '1.1',
        display: 'block',
        position: 'relative',
        zIndex: '10'
    };

    return (
        <div className="combined-sections-wrapper">
            <h2 className="combined-sections-main-title">
                One Platform, Endless Possibilities
            </h2>
            
            <div className="combined-sections-container">
                {/* Features Section */}
                <div className="combined-section features-section">
                    <h2 
                        className="section-title features-title"
                        style={smartLearningStyle}
                    >
                        Smart Learning
                    </h2>
                    <div className="feature-list">
                        {features.map((feature, index) => (
                            <FeatureListItem
                                key={`feature-${index}`}
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                buttonText={feature.buttonText}
                                onClick={feature.onClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Community Section */}
                <div className="combined-section community-section">
                    <h2 
                        className="section-title community-title"
                        style={vibrantCommunityStyle}
                    >
                        Vibrant Community
                    </h2>
                    <div className="feature-list">
                        {communityFeatures.map((feature, index) => (
                            <FeatureListItem
                                key={`community-${index}`}
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                buttonText={feature.buttonText}
                                onClick={feature.onClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CombinedSections;
