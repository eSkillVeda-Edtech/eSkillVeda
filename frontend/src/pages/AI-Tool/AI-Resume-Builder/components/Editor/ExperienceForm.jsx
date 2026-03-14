import React, { useState } from 'react';
import { useResume } from "../../context/useResume";
import { LucideTrash2, Edit3, LucideX, Menu, Check, X } from 'lucide-react';
import RichTextEditor from '../TextEditorComponent/RichTextEditor';
import './Forms.css';

const ExperienceForm = () => {
  const { resumeData, setResumeData } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentExperience, setCurrentExperience] = useState({
    title: '', company: '', location: '', startDate: '', endDate: '', description: ''
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const resetForm = () => {
    setCurrentExperience({
      title: '', company: '', location: '', startDate: '', endDate: '', description: ''
    });
  };

  const handleSave = () => {
    if (!currentExperience.title || !currentExperience.company) {
      alert('Please fill in required fields (Title and Company)');
      return;
    }
    setResumeData(prevData => {
      const updatedExperience = [...(prevData.experience || [])];
      if (editingIndex >= 0) {
        updatedExperience[editingIndex] = currentExperience;
      } else {
        updatedExperience.push(currentExperience);
      }
      return { ...prevData, experience: updatedExperience };
    });
    resetForm();
    setIsAddingNew(false);
    setEditingIndex(-1);
  };

  const handleEdit = (index) => {
    setCurrentExperience(resumeData.experience[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
    setIsPanelOpen(false);
  };

  const handleDelete = (index) => {
    setResumeData(prevData => ({
      ...prevData,
      experience: prevData.experience.filter((_, i) => i !== index)
    }));
  };

  const handleCancel = () => {
    resetForm();
    setIsAddingNew(false);
    setEditingIndex(-1);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddingNew(true);
    setEditingIndex(-1);
    setIsPanelOpen(false);
  };

  return (
    <div className="form-section">
      <div className="form-card unified-form-card">
        
        {/* Sliding Panel */}
        <div className={`form-sliding-panel ${isPanelOpen ? 'open' : ''}`}>
          <div className="form-panel-header">
            <h4>Saved Experience</h4>
            <button
              type="button"
              className="form-panel-close"
              onClick={() => setIsPanelOpen(false)}
              aria-label="Close panel"
            >
              <LucideX size={18} />
            </button>
          </div>
          
          <div className="form-panel-content">
            <div className="form-panel-list">
              {resumeData.experience && resumeData.experience.length > 0 ? (
                resumeData.experience.map((exp, index) => (
                  <div 
                    key={index} 
                    className={`form-panel-item ${editingIndex === index ? 'active' : ''}`}
                  >
                    <div className="panel-item-content">
                      <h5 className="panel-item-title">{exp.title}</h5>
                      <p className="panel-item-subtitle">{exp.company}</p>
                    </div>
                    <div className="panel-item-actions">
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(index)}
                        aria-label="Edit experience"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(index)}
                        aria-label="Delete experience"
                      >
                        <LucideTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="form-panel-empty">
                  <p>No experience added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Form Header */}
        <div className="unified-form-header" style={{ display: 'flex' }}>
          {isAddingNew && (
            <>
              <button
                type="button"
                className="header-action-btn cancel-btn-icon" // MODIFIED: Changed class
                onClick={handleCancel}
                aria-label="Cancel"
              >
                <X size={20} />
              </button>
              <button
                type="button"
                className="header-action-btn save-btn-icon" // MODIFIED: Changed class
                onClick={handleSave}
                aria-label="Save"
              >
                <Check size={20} />
              </button>
            </>
          )}
          <button
            type="button"
            className="header-action-btn panel-toggle-btn"
            onClick={() => setIsPanelOpen(true)}
            aria-label="Show saved experience"
            style={{
              marginLeft: isAddingNew ? '0.5rem' : '0',
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Main Form Content */}
        <div className="form-main-content">
          {isAddingNew ? (
            <>
              <div className="unified-form-title">
                <h4>{editingIndex >= 0 ? 'Edit Experience' : 'Add Experience'}</h4>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="exp-title">Job Title</label>
                  <input
                    id="exp-title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software Engineer"
                    value={currentExperience.title}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience,
                      title: e.target.value
                    })}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="exp-company">Company</label>
                  <input
                    id="exp-company"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Google"
                    value={currentExperience.company}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience,
                      company: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <label htmlFor="exp-location">Location</label>
                  <input
                    id="exp-location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bangalore"
                    value={currentExperience.location}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience,
                      location: e.target.value
                    })}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="exp-start">Start Date</label>
                  <input
                    id="exp-start"
                    type="text"
                    className="form-input"
                    placeholder="e.g June 2026"
                    value={currentExperience.startDate}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience,
                      startDate: e.target.value
                    })}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="exp-end">End Date</label>
                  <input
                    id="exp-end"
                    type="text"
                    className="form-input"
                    placeholder="e.g. August 2026"
                    value={currentExperience.endDate}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience,
                      endDate: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="exp-description">Description</label>
<RichTextEditor
  value={currentExperience.description}
  onChange={(value) => setCurrentExperience({
    ...currentExperience,
    description: value
  })}
  placeholder="Describe your responsibilities and achievements..."
  enhancerType="experience"
/>
              </div>
            </>
          ) : (
            <div className="form-placeholder">
              <div className="placeholder-content">
                <h4>Experience Editor</h4>
                <p>Click "Add Experience" or select from saved items to get started.</p>
                <button
                  type="button"
                  className="add-btn add-btn-large"
                  onClick={handleAddNew}
                >
                  Add Experience
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;