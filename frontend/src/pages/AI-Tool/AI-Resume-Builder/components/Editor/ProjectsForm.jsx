import React, { useState } from 'react';
import { useResume } from "../../context/useResume";
import { LucideTrash2, Edit3, LucideX, Menu, Check, X } from 'lucide-react';
import RichTextEditor from '../TextEditorComponent/RichTextEditor';
import './Forms.css';

const ProjectsForm = () => {
  const { resumeData, setResumeData } = useResume();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentProject, setCurrentProject] = useState({ name: '', description: '' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const resetForm = () => {
    setCurrentProject({ name: '', description: '' });
  };

  const handleSave = () => {
    if (!currentProject.name) {
      alert('Please fill in the project name');
      return;
    }
    setResumeData(prevData => {
        const updatedProjects = [...(prevData.projects || [])];
        if (editingIndex >= 0) {
            updatedProjects[editingIndex] = currentProject;
        } else {
            updatedProjects.push(currentProject);
        }
        return { ...prevData, projects: updatedProjects };
    });
    resetForm();
    setIsAddingNew(false);
    setEditingIndex(-1);
  };

  const handleEdit = (index) => {
    setCurrentProject(resumeData.projects[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
    setIsPanelOpen(false);
  };

  const handleDelete = (index) => {
    setResumeData(prevData => ({
        ...prevData,
        projects: prevData.projects.filter((_, i) => i !== index)
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
            <h4>Saved Projects</h4>
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
              {resumeData.projects && resumeData.projects.length > 0 ? (
                resumeData.projects.map((project, index) => (
                  <div 
                    key={index} 
                    className={`form-panel-item ${editingIndex === index ? 'active' : ''}`}
                  >
                    <div className="panel-item-content">
                      <h5 className="panel-item-title">{project.name}</h5>
                      {project.description && (
                        <p className="panel-item-subtitle">
                          {project.description.replace(/<[^>]*>/g, '').substring(0,60)}...
                        </p>
                      )}
                    </div>
                    <div className="panel-item-actions">
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(index)}
                        aria-label="Edit project"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(index)}
                        aria-label="Delete project"
                      >
                        <LucideTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="compact-panel-empty">
                  <p>No projects added yet</p>
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
            aria-label="Show saved projects"
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
                <h4>{editingIndex >= 0 ? 'Edit Project' : 'Add Project'}</h4>
              </div>
              
              <div className="form-group">
                <label htmlFor="project-name">Project Name *</label>
                <input
                  id="project-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. E-commerce Website"
                  value={currentProject.name}
                  onChange={(e) => setCurrentProject({
                    ...currentProject,
                    name: e.target.value
                  })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <RichTextEditor
                  value={currentProject.description}
                  onChange={(value) => setCurrentProject({
                    ...currentProject,
                    description: value
                  })}
                  placeholder="Describe your project, technologies used, features, and achievements..."
                  enhancerType="project"
                />
              </div>
            </>
          ) : (
            <div className="form-placeholder">
              <div className="placeholder-content">
                <h4>Project Editor</h4>
                <p>Click "Add Project" or select from saved items to get started.</p>
                <button
                  type="button"
                  className="add-btn add-btn-large"
                  onClick={handleAddNew}
                >
                  Add Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsForm;