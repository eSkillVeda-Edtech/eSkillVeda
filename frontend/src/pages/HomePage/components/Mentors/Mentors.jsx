import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';
import { mentorData } from '../mentorData';
import './Mentors.css';

const Mentors = () => {
  // Split data into two rows: 3 on first, 3 on second
  const firstRow = mentorData.slice(0, 3);
  const secondRow = mentorData.slice(3, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="mentors-section">
      <div className="mentors-container">
        <div className="section-header">
          <motion.span 
            className="section-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Expert Guidance
          </motion.span>
          <motion.h2 
            className="section-title section-subtitle-heading"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Mentors
          </motion.h2>
          <motion.div 
            className="title-underline"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "80px", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        <motion.div 
          className="mentors-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* First Row: 3 Mentors */}
          <div className="mentors-row first-row">
            {firstRow.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} variants={itemVariants} />
            ))}
          </div>

          {/* Second Row: 2 Mentors */}
          <div className="mentors-row second-row">
            {secondRow.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} variants={itemVariants} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MentorCard = ({ mentor, variants }) => {
  return (
    <motion.div className="mentor-card" variants={variants}>
      <div className="mentor-image-container">
        <img src={mentor.image} alt={mentor.name} className="mentor-image" />
      </div>
      <div className="mentor-info">
        <h3 className="mentor-name">{mentor.name}</h3>
        <p className="mentor-role">{mentor.role}</p>
        <div className="mentor-socials">
          <a href={mentor.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
            <Linkedin size={18} />
          </a>
          <a href={mentor.socials.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
            <Instagram size={18} />
          </a>
          <a href={mentor.socials.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
            <Facebook size={18} />
          </a>
          <a href={mentor.socials.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
            <Twitter size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default Mentors;
