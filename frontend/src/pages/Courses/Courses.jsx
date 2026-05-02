import React, { useState, useMemo } from "react";
import { BookOpen, Cpu, Database, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "./Courses.css";

// --- DATA ---
const coursesData = [
  {
    id: "rag-for-beginners", // MUST match data.js key
    title: "RAG for Beginners",
    skills: ["Vector Databases", "Embeddings", "Python", "LLMs", "Data Chunking"],
    category: "Data & AI",
    status: "Active",
    duration: "8 weeks",
    level: "Beginner",
  },
];

// --- HELPER FUNCTION ---
function getCourseIcon(category) {
  switch (category) {
    case "Artificial Intelligence":
      return Cpu;
    case "Data & AI":
      return Database;
    default:
      return BookOpen;
  }
}

// --- COURSE CARD COMPONENT ---
const CourseCard = ({ course, onEnroll }) => {
  const Icon = getCourseIcon(course.category);
  const isComingSoon = course.status === "Coming Soon";

  return (
    <motion.div
      className="course-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      aria-label={`Course: ${course.title}`}
    >
      <div className="course-card-content">
        <div className="course-card-header">
          <div className="course-card-icon">
            <Icon size={24} aria-hidden="true" />
          </div>
          <h3 className="course-card-title">{course.title}</h3>
        </div>

        <div className="course-card-info">
          <p className="course-card-details">
            {course.duration} • {course.level}
          </p>
          <div className="course-skills">
            {course.skills.map((skill, index) => (
              <span key={`${course.id}-skill-${index}`} className="course-skill-pill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        className={`course-enroll-btn ${isComingSoon ? "disabled" : ""}`}
        disabled={isComingSoon}
        onClick={(e) => {
          e.stopPropagation();
          if (!isComingSoon) onEnroll(course);
        }}
        aria-disabled={isComingSoon}
      >
        {isComingSoon ? "Coming Soon" : "View Roadmap"}
      </button>
    </motion.div>
  );
};

// --- MAIN COURSES COMPONENT ---
const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return coursesData;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return coursesData.filter((course) => {
      return (
        course.title.toLowerCase().includes(lowerCaseSearch) ||
        course.skills.some((skill) => skill.toLowerCase().includes(lowerCaseSearch))
      );
    });
  }, [searchTerm]);

  const handleEnrollCourse = (course) => {
    if (course.status === "Coming Soon") return;
    navigate(`/roadmap/${course.id}`);
  };

  return (
    <div className="courses-page">
      <div className="courses-left-column">
        <div className="courses-header">
          <h1 className="courses-title">Courses</h1>
          <p className="courses-subtitle">
            Master the future of technology with our specialized curriculum.
          </p>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search courses or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="courses-search"
            aria-label="Search courses"
          />
        </div>
      </div>

      <div className="courses-right-column">
        <div className="courses-list">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onEnroll={handleEnrollCourse} />
            ))
          ) : (
            <div className="courses-empty" role="status">
              No courses found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;