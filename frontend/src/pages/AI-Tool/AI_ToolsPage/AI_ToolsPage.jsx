import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mic, GitFork, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // Adjusted path for consistency
import './AI_ToolsPage.css';

// --- DATA ---
const aiTools = [
  {
    id: 1,
    name: 'AI Resume Builder',
    skills: ['ATS Friendly', 'Professional Templates'],
    status: 'Active',
    path: '/resume-homepage',
    icon: FileText,
  },
  {
    id: 2,
    name: 'AI Mock Interview',
    skills: ['Real-time Feedback','Performance Analytics'],
    status: 'Coming Soon',
    path: '#',
    icon: Mic,
  },
  {
    id: 3,
    name: 'DiagramGPT',
    skills: ['Text-to-Diagram', "Flowcharts"],
    status: 'Coming Soon',
    path: '#',
    icon: GitFork,
  }
];

// --- TOOL CARD COMPONENT ---
const ToolCard = ({ tool, onUse }) => {
  const Icon = tool.icon;
  const isComingSoon = tool.status === 'Coming Soon';

  return (
    <motion.div
      className="tool-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="tool-icon"><Icon /></div>
      <div className="tool-info">
        <h3 className="tool-title">{tool.name}</h3>
        <div className="tool-skills">
          {tool.skills.map((skill, idx) => (
            <span key={idx} className="tool-skill-pill">{skill}</span>
          ))}
        </div>
      </div>
      <button
        className={`tool-use-btn ${isComingSoon ? 'disabled' : ''}`}
        disabled={isComingSoon}
        onClick={e => {
          e.preventDefault();
          if (!isComingSoon) onUse(tool);
        }}
      >
        {isComingSoon ? 'Coming Soon' : 'Use Tool'}
      </button>
    </motion.div>
  );
};

// --- MAIN AI TOOLS PAGE COMPONENT ---
const AI_ToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Simplified filter logic - only search term
  const filteredTools = useMemo(() => {
    return aiTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleUseTool = (tool) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (tool.status === 'Active' && tool.path && tool.path !== '#') {
      navigate(tool.path);
    }
  };

  return (
    <div className="ai-tools-page">
      {/* --- LEFT COLUMN --- */}
      <div className="ai-tools-left-column">
        <div className="ai-tools-header">
          <h1 className="ai-tools-title">AI Tools</h1>
          <p className="ai-tools-subtitle">
            Powerful AI-driven tools to boost your productivity
          </p>
        </div>
        {/* Category filters removed */}
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="ai-tools-search"
          />
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="ai-tools-right-column">
        <div className="ai-tools-list">
          {filteredTools.length ? (
            filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} onUse={handleUseTool} />
            ))
          ) : (
            <div className="ai-tools-empty">
              No tools found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AI_ToolsPage;
