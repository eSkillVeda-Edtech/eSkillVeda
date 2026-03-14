import { useResume } from "../../context/useResume";
import { useState, useEffect } from "react";
import { RESUME_API_BASE } from "../../../../../services/api";
import { LucideX } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import './Forms.css';

const SkillsForm = () => {
  const { resumeData, setResumeData } = useResume();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySkills, setCategorySkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${RESUME_API_BASE}/skills/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        
        const formattedCategories = [
          { value: "", label: "Select category" },
          ...data.categories.map(cat => ({
            value: cat,
            label: cat.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
          }))
        ];
        
        setCategories(formattedCategories);
      } catch (err) {
        console.error("Could not fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch skills by category when category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setCategorySkills([]);
      return;
    }

    const fetchCategorySkills = async () => {
      try {
        const response = await fetch(`${RESUME_API_BASE}/skills/categories/${selectedCategory}`);
        if (!response.ok) throw new Error('Failed to fetch category skills');
        const data = await response.json();
        setCategorySkills(data.skills || []);
      } catch (err) {
        console.error("Could not fetch category skills:", err);
        setCategorySkills([]);
      }
    };

    fetchCategorySkills();
  }, [selectedCategory]);

  // Debounced effect for searching skills via API
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${RESUME_API_BASE}/skills/search?query=${encodeURIComponent(searchTerm)}&max_results=8`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSearchSuggestions(data.skills || []);
      } catch (err) {
        setError("Could not fetch skills.");
        setSearchSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSkills, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  const addSkill = (skillToAdd) => {
    const trimmedSkill = skillToAdd.trim();
    if (trimmedSkill) {
        // ✅ FIXED: Use functional update to avoid stale state.
        setResumeData(prevData => {
            if (!prevData.skills.includes(trimmedSkill)) {
                return { ...prevData, skills: [...prevData.skills, trimmedSkill] };
            }
            return prevData;
        });
    }
    setSearchTerm("");
    setSearchSuggestions([]);
  };

  const removeSkill = (skillToRemove) => {
    // ✅ FIXED: Use functional update.
    setResumeData(prevData => ({
        ...prevData,
        skills: prevData.skills.filter((skill) => skill !== skillToRemove)
    }));
  };
  
  
  // ✅ REFACTORED: New logic to get suggestions.
  const getFinalSuggestions = () => {
    // 1. Never show suggestions if the search bar is empty.
    if (!searchTerm.trim()) {
      return [];
    }

    let potentialSuggestions = [];

    // 2. If a category is selected, prioritize filtering its skills based on the search term.
    if (selectedCategory && categorySkills.length > 0) {
      const categoryFiltered = categorySkills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
      potentialSuggestions.push(...categoryFiltered);
    }
    
    // 3. Add general API search suggestions.
    potentialSuggestions.push(...searchSuggestions);

    // 4. Create a unique, filtered list that excludes already added skills.
    const uniqueSuggestions = [...new Set(potentialSuggestions)];
    return uniqueSuggestions.filter(skill => !resumeData.skills.includes(skill)).slice(0, 8);
  };

  const finalSuggestions = getFinalSuggestions();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (finalSuggestions.length > 0) {
        addSkill(finalSuggestions[0]);
      } else if (searchTerm.trim()) {
        addSkill(searchTerm);
      }
    }
  };
  
  // ✅ MODIFIED: Dropdown only shows when there is a search term.
  const showSearchDropdown = searchTerm.trim() && (loading || error || finalSuggestions.length > 0 || !loading);

  return (
    <div className="form-section">
      <div className="form-card">
        <div className="skills-input-section">
          <div className="skills-triple-row">
            {/* Search Bar */}
            <div className="skills-search-group">
              <div className="form-group">
                <label htmlFor="skills-search">Search or Add Skill</label>
                <div className="skills-input-container">
                  <input
                    id="skills-search"
                    type="text"
                    className="form-input"
                    placeholder="e.g. C++"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />
                  
                  {showSearchDropdown && (
                    <div className="skills-dropdown">
                      {loading && <p className="dropdown-message">Searching...</p>}
                      {error && <p className="dropdown-message error">{error}</p>}
                      {/* ✅ Use finalSuggestions list */}
                      {!loading && finalSuggestions.map((skill) => (
                        <button
                          key={skill}
                          className="dropdown-item"
                          onClick={() => addSkill(skill)}
                          type="button"
                        >
                          {skill}
                        </button>
                      ))}
                      {/* ✅ Use finalSuggestions list */}
                      {!loading && !error && finalSuggestions.length === 0 && searchTerm && (
                        <p className="dropdown-message">
                          No skills found. Press Enter to add "{searchTerm}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="skills-category-group">
              <div className="form-group">
                <CustomDropdown
                  label="Browse by Category"
                  options={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="..."
                  className="category-dropdown"
                />
              </div>
            </div>

            {/* Add Button */}
            <div className="skills-add-group">
              <div className="form-group">
                <label>&nbsp;</label>
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addSkill(searchTerm)}
                  disabled={!searchTerm.trim() || loading}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="skills-divider">
          <div className="divider-line"></div>
          <span className="divider-text">Your Skills</span>
          <div className="divider-line"></div>
        </div>

        {/* Skills Display Section */}
        <div className="skills-display-section">
          {resumeData.skills.length === 0 ? (
            <div className="skills-placeholder">
              <p>Added skills will appear here.</p>
            </div>
          ) : (
            <div className="skills-list">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="skill-chip">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    <LucideX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;