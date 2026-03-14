import React, { useState } from 'react';
import { useResume } from "../../context/useResume";
import { LucideTrash2, Edit3, LucideX, Menu, Check, X } from 'lucide-react';
import './Forms.css';

const EducationForm = () => {
  const { resumeData, setResumeData } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentEducation, setCurrentEducation] = useState({ institute: '', degree: '', graduationDate: '' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const resetForm = () => {
    setCurrentEducation({ institute: '', degree: '', graduationDate: '' });
  };

  const handleSave = () => {
    if (!currentEducation.degree || !currentEducation.institute) {
      alert('Please fill in required fields (Degree and Institute)');
      return;
    }
    setResumeData(prevData => {
        const updatedEducation = [...(prevData.education || [])];
        if (editingIndex >= 0) {
            updatedEducation[editingIndex] = currentEducation;
        } else {
            updatedEducation.push(currentEducation);
        }
        return { ...prevData, education: updatedEducation };
    });
    resetForm();
    setIsAddingNew(false);
    setEditingIndex(-1);
  };

  const handleEdit = (index) => {
    setCurrentEducation(resumeData.education[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
    setIsPanelOpen(false);
  };

  const handleDelete = (index) => {
    setResumeData(prevData => ({
        ...prevData,
        education: prevData.education.filter((_, i) => i !== index)
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
        
        {/* Sliding Panel - Compact Layout */}
        <div className={`form-sliding-panel ${isPanelOpen ? 'open' : ''}`}>
          <div className="compact-panel-header">
            <h4>Saved Education</h4>
            <button
              type="button"
              className="form-panel-close"
              onClick={() => setIsPanelOpen(false)}
              aria-label="Close panel"
            >
              <LucideX size={18} />
            </button>
          </div>
          
          <div className="compact-panel-content">
            <div className="compact-panel-list">
              {resumeData.education && resumeData.education.length > 0 ? (
                resumeData.education.map((edu, index) => (
                  <div 
                    key={index} 
                    className={`form-panel-item ${editingIndex === index ? 'active' : ''}`}
                  >
                    <div className="panel-item-content">
                      <h5 className="panel-item-title">{edu.degree}</h5>
                      <p className="panel-item-subtitle">{edu.institute}</p>
                      {edu.graduationDate && (
                        <p className="panel-item-date">{edu.graduationDate}</p>
                      )}
                    </div>
                    <div className="panel-item-actions">
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(index)}
                        aria-label="Edit education"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(index)}
                        aria-label="Delete education"
                      >
                        <LucideTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="compact-panel-empty">
                  <p>No education added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Form Header - With Clean Icon Buttons */}
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
            aria-label="Show saved education"
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
                <h4>{editingIndex >= 0 ? 'Edit Education' : 'Add Education'}</h4>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="edu-degree">Degree/Qualification</label>
                  <input
                    id="edu-degree"
                    type="text"
                    className="form-input"
                    placeholder="e.g. B.Tech CSE"
                    value={currentEducation.degree}
                    onChange={(e) => setCurrentEducation({
                      ...currentEducation,
                      degree: e.target.value
                    })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edu-institute">Institute/University</label>
                  <input
                    id="edu-institute"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dhemaji Engineering College"
                    value={currentEducation.institute}
                    onChange={(e) => setCurrentEducation({
                      ...currentEducation,
                      institute: e.target.value
                      })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edu-date">Graduation Year</label>
                  <input
                    id="edu-date"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2026"
                    value={currentEducation.graduationDate}
                    onChange={(e) => setCurrentEducation({
                      ...currentEducation,
                      graduationDate: e.target.value
                    })}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="form-placeholder">
              <div className="placeholder-content">
                <h4>Education Editor</h4>
                <p>Click "Add Education" or select from saved items to get started.</p>
                <button
                  type="button"
                  className="add-btn add-btn-large"
                  onClick={handleAddNew}
                >
                  Add Education
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationForm;