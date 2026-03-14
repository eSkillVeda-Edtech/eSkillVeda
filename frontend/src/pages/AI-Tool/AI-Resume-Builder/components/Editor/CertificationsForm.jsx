import React, { useState } from 'react';
import { useResume } from "../../context/useResume";
// MODIFIED: Imported Check and X icons for consistency
import { LucideTrash2, Edit3, LucideX, Menu, Check, X } from 'lucide-react';
import './Forms.css';

const CertificationsForm = () => {
  const { resumeData, setResumeData } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentCertification, setCurrentCertification] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const resetForm = () => {
    setCurrentCertification('');
  };

  const handleSave = () => {
    if (!currentCertification.trim()) {
      alert('Please enter a certification name');
      return;
    }
    setResumeData(prevData => {
        const updatedCertifications = [...(prevData.certifications || [])];
        if (editingIndex >= 0) {
            updatedCertifications[editingIndex] = currentCertification;
        } else {
            updatedCertifications.push(currentCertification);
        }
        return { ...prevData, certifications: updatedCertifications };
    });
    resetForm();
    setIsAddingNew(false);
    setEditingIndex(-1);
  };

  const handleEdit = (index) => {
    setCurrentCertification(resumeData.certifications[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
    setIsPanelOpen(false);
  };

  const handleDelete = (index) => {
    setResumeData(prevData => ({
        ...prevData,
        certifications: prevData.certifications.filter((_, i) => i !== index)
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

  // REMOVED: Custom SVG icons are no longer needed

  return (
    <div className="form-section">
      <div className="form-card unified-form-card">
        
        {/* Sliding Panel - Compact Layout */}
        <div className={`form-sliding-panel ${isPanelOpen ? 'open' : ''}`}>
          <div className="compact-panel-header">
            <h4>Saved Certifications</h4>
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
              {resumeData.certifications && resumeData.certifications.length > 0 ? (
                resumeData.certifications.map((cert, index) => (
                  <div 
                    key={index} 
                    className={`form-panel-item ${editingIndex === index ? 'active' : ''}`}
                  >
                    <div className="panel-item-content">
                      <h5 className="panel-item-title">{cert}</h5>
                    </div>
                    <div className="panel-item-actions">
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(index)}
                        aria-label="Edit certification"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(index)}
                        aria-label="Delete certification"
                      >
                        <LucideTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="compact-panel-empty">
                  <p>No certifications added yet</p>
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
            aria-label="Show saved certifications"
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
                <h4>{editingIndex >= 0 ? 'Edit Certification' : 'Add Certification'}</h4>
              </div>
              
              <div className="form-group">
                <label htmlFor="cert-name">Certification Name *</label>
                <input
                  id="cert-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AWS Cloud Certification"
                  value={currentCertification}
                  onChange={(e) => setCurrentCertification(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="form-placeholder">
              <div className="placeholder-content">
                <h4>Certification Editor</h4>
                <p>Click "Add Certification" or select from saved items to get started.</p>
                <button
                  type="button"
                  className="add-btn add-btn-large"
                  onClick={handleAddNew}
                >
                  Add Certification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationsForm;
