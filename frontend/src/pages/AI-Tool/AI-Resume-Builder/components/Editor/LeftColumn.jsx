import React from 'react';
import { LucideCheckCircle, LucideDownload, LucideTrash2, LucideEye, LucideEdit, LucideRotateCcw } from "lucide-react";
import CustomDropdown from './CustomDropdown'; // Import the custom component

const LeftColumn = ({
  steps,
  currentStep,
  onStepChange,
  template,
  onTemplateChange,
  templates,
  isDownloading,
  onDownloadPdf,
  onReset,
  onDelete,
  showPreview,
  onTogglePreview
}) => {
  // Convert the simple array of template strings into the object format the dropdown expects
  const templateOptions = templates.map(t => ({
    value: t,
    label: t,
  }));

  return (
    <div className="resume-builder-left-column">
      <div className="resume-builder-header">
        <h1 className="resume-builder-title">Resume Builder</h1>
        <p className="resume-builder-subtitle">
          Build and customize your resume.
        </p>
      </div>

      <div className="top-action-buttons">
        <button 
          onClick={onDownloadPdf} 
          className="top-action-btn" 
          title="Download PDF" 
          disabled={isDownloading}
        >
          <LucideDownload size={18} />
        </button>
        <button 
          onClick={onReset} 
          className="top-action-btn" 
          title="Reset Fields" 
          disabled={isDownloading}
        >
          <LucideRotateCcw size={18} />
        </button>
        <button 
          onClick={onDelete} 
          className="top-action-btn danger" 
          title="Delete Resume" 
          disabled={isDownloading}
        >
          <LucideTrash2 size={18} />
        </button>
      </div>

      <div className="resume-builder-controls">
        <div className="template-control-container">
          {/* The entire select element is replaced by the CustomDropdown component */}
          <div className="template-preview-wrapper">
            <CustomDropdown
              label="Choose Template"
              options={templateOptions}
              value={template}
              onChange={onTemplateChange}
              disabled={isDownloading}
              className="template-dropdown-container" // Added for layout control
            />
            <button
              onClick={onTogglePreview}
              className="preview-icon-btn"
              disabled={isDownloading}
            >
              {showPreview ? <LucideEdit size={20} /> : <LucideEye size={20} />}
            </button>
          </div>
        </div>

        <div className="step-navigation">
          <h3 className="step-navigation-title">Complete Your Resume</h3>
          <div className="step-list">
            {steps.map((s, index) => (
              <button
                key={index}
                className={`step-btn ${currentStep === index ? "active" : ""}`}
                onClick={() => onStepChange(index)}
                disabled={isDownloading}
              >
                <s.icon size={18} />
                <span>{s.label}</span>
                {s.isComplete && ( // Assuming a step can be marked complete
                  <LucideCheckCircle size={16} className="step-check" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;