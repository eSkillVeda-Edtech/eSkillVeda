// src/pages/app/ResumeBuilder/components/Editor/EditorPanel.jsx

import { LucideChevronLeft, LucideChevronRight, LucideSave, LucideRefreshCw, LucideLoader2 } from "lucide-react";
import ResumePreview from '../Preview/ResumePreview';

const EditorPanel = ({
    steps, currentStep, onStepChange, showPreview, template, onSave, isSaving, resumeId,
    // This prop is needed to show the live preview
    resumeData
}) => {
    const StepComponent = steps[currentStep].component;
    const isLastStep = currentStep === steps.length - 1;

    const handlePrevStep = () => {
        onStepChange(Math.max(0, currentStep - 1));
    };

    const handleNextStep = () => {
        if (!isLastStep) {
            onStepChange(Math.min(steps.length - 1, currentStep + 1));
        }
    };

    return (
        <div className="resume-builder-right-column">
            <div className="step-content-container">
                <div className="step-header">
                    <h2 className="step-title">
                        {showPreview ? "Live Preview" : steps[currentStep].label}
                    </h2>
                    <div className="step-meta">
                        {!showPreview && (
                            <span className="step-counter">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        )}
                    </div>
                    <div className="header-actions">
                        {!showPreview && (
                            <div className="step-navigation-controls">
                                {/* Save/Update button now appears first and on all steps */}
                                {resumeId ? (
                                    <button onClick={onSave} disabled={isSaving} className="nav-btn update" title="Update Resume">
                                        {isSaving ? <LucideLoader2 size={20} className="animate-spin" /> : <LucideRefreshCw size={20} />}
                                    </button>
                                ) : (
                                    <button onClick={onSave} disabled={isSaving} className="nav-btn save" title="Save Resume">
                                        {isSaving ? <LucideLoader2 size={20} className="animate-spin" /> : <LucideSave size={20} />}
                                    </button>
                                )}

                                {/* Previous Button */}
                                <button
                                    onClick={handlePrevStep}
                                    disabled={currentStep === 0 || isSaving}
                                    className="nav-btn prev"
                                    title="Previous Step"
                                >
                                    <LucideChevronLeft size={20} />
                                </button>
                                
                                {/* Next button is hidden on the last step */}
                                {!isLastStep && (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={isLastStep || isSaving}
                                        className="nav-btn next"
                                        title="Next Step"
                                    >
                                        <LucideChevronRight size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="step-content">
                    {showPreview ? (
                        <div className="preview-container-wrapper">
                            <ResumePreview templateName={template} liveData={resumeData} />
                        </div>
                    ) : (
                        <StepComponent />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;