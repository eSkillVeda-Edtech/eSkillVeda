import React, { useState, useMemo } from 'react';
import { BookOpen, Code2, Briefcase, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Courses.css';
import { motion } from 'framer-motion';

// --- DATA ---
const coursesData = [
  {
    id: 1,
    title: 'React Development Bootcamp',
    skills: ['React', 'Hooks', 'Context', 'Best Practices'],
    category: 'Programming',
    status: 'Active',
    duration: '8 weeks',
    level: 'Beginner'
  },
  {
    id: 2,
    title: 'Business Strategy Fundamentals',
    skills: ['Strategy', 'Market Analysis'],
    category: 'Business',
    status: 'Active',
    duration: '6 weeks',
    level: 'Intermediate'
  },
  {
    id: 3,
    title: 'Career Development Workshop',
    skills: ['Career Growth', 'Soft Skills', 'Leadership'],
    category: 'Career',
    status: 'Coming Soon',
    duration: '4 weeks',
    level: 'All Levels'
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    skills: ['User Research', 'Design Thinking'],
    category: 'Design',
    status: 'Active',
    duration: '10 weeks',
    level: 'Beginner'
  }
];

// --- HELPER FUNCTION ---
function getCourseIcon(category) {
  switch (category) {
    case 'Programming': return Code2;
    case 'Business': return Briefcase;
    case 'Career': return TrendingUp;
    case 'Design': return BookOpen;
    default: return BookOpen;
  }
}

// --- COURSE CARD COMPONENT ---
const CourseCard = ({ course, onEnroll }) => {
  const Icon = getCourseIcon(course.category);
  const isComingSoon = course.status === 'Coming Soon';

  return (
    <motion.div 
      className="course-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="course-card-icon"><Icon /></div>
      <div className="course-card-info">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-details">{course.duration} • {course.level}</p>
        <div className="course-skills">
          {course.skills.map((skill, index) => (
            <span key={index} className="course-skill-pill">{skill}</span>
          ))}
        </div>
      </div>
      <button 
        className={`course-enroll-btn ${isComingSoon ? 'disabled' : ''}`}
        disabled={isComingSoon}
        onClick={(e) => {
          e.stopPropagation();
          if (!isComingSoon) onEnroll(course);
        }}
      >
        {isComingSoon ? 'Coming Soon' : 'Enroll'}
      </button>
    </motion.div>
  );
};

// --- MAIN COURSES COMPONENT ---
const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Simplified filter logic - only search term
  const filteredCourses = useMemo(() => {
    return coursesData.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleEnrollCourse = (course) => {
    if (course.status === 'Coming Soon') return;
    if (!user) {
      navigate('/auth');
      return;
    }
  };

  return (
    <div className="courses-page">
      {/* --- LEFT COLUMN --- */}
      <div className="courses-left-column">
        <div className="courses-header">
          <h1 className="courses-title">Courses</h1>
          <p className="courses-subtitle">
            Learn in-demand programming, business, design & career skills
          </p>
        </div>
        {/* Category filters removed */}
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="courses-search"
          />
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="courses-right-column">
        <div className="courses-list">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnrollCourse}
              />
            ))
          ) : (
            <div className="courses-empty">
              No courses found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

