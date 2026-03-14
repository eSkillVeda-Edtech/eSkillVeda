// src/pages/app/ResumeBuilder/ResumeBuilder.jsx

import { useEffect, useState } from "react";
import { useResume } from "../context/useResume";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LucideUser, LucideWrench, LucideBriefcase, LucideFolderKanban, LucideAward,
    LucideGraduationCap, LucideAlignLeft,
} from "lucide-react";

// Component Imports
import ContactForm from "../components/Editor/ContactForm";
import SummaryForm from "../components/Editor/SummaryForm";
import SkillsForm from "../components/Editor/SkillsForm";
import ExperienceForm from "../components/Editor/ExperienceForm";
import ProjectsForm from "../components/Editor/ProjectsForm";
import CertificationsForm from "../components/Editor/CertificationsForm";
import EducationForm from "../components/Editor/EducationForm";
import EditorPanel from "../components/Editor/EditorPanel";
import LeftColumn from "../components/Editor/LeftColumn";
import ResumePreview from "../components/Preview/ResumePreview"; 

// API Imports
import { fetchTemplates, generateResumePDF, downloadBlob, saveResume, getResumeById, deleteResumeById } from "../../../../services/resumeAPI";
import "./ResumeBuilder.css";

const steps = [
    { label: "Personal", icon: LucideUser, component: ContactForm },
    { label: "Skills *", icon: LucideWrench, component: SkillsForm },
    { label: "Experience", icon: LucideBriefcase, component: ExperienceForm },
    { label: "Project", icon: LucideFolderKanban, component: ProjectsForm },
    { label: "Certification", icon: LucideAward, component: CertificationsForm },
    { label: "Education", icon: LucideGraduationCap, component: EducationForm },
    { label: "Summary", icon: LucideAlignLeft, component: SummaryForm },
];

const ResumeBuilder = () => {
    const { saved, resetResume, resumeData, setResumeData } = useResume();
    const [step, setStep] = useState(0);
    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState(""); 
    const [isDownloading, setIsDownloading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [resumeId, setResumeId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('resume_id');
        
        if (id) {
            setResumeId(id);
            const loadResumeData = async () => {
                try {
                    toast.loading("Loading resume data...", { id: "resume-load" });
                    const data = await getResumeById(id);
                    if (data && data.content) {
                        setResumeData(data.content);
                        toast.success("Resume data loaded!", { id: "resume-load" });
                    } else {
                        toast.error("Could not find resume data.", { id: "resume-load" });
                        navigate("/dashboard");
                    }
                } catch (error) {
                    toast.error(`Failed to load resume data: ${error.message}`, { id: "resume-load" });
                    navigate("/dashboard");
                }
            };
            loadResumeData();
        } else {
            resetResume();
            setResumeId(null);
        }
    }, [location, setResumeData, navigate, resetResume]);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const response = await fetchTemplates();
                const templateList = response.templates;
                if (Array.isArray(templateList) && templateList.length > 0) {
                    setTemplates(templateList);
                    setTemplate(templateList[0]);
                } else {
                    setTemplates([]);
                }
            } catch (e) {
                console.error("Failed to load templates:", e);
                toast.error("Failed to load templates from backend");
            }
        };
        
        loadTemplates();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDownloading || isSaving) {
                e.preventDefault();
                e.returnValue = "Action in progress. Are you sure you want to leave?";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDownloading, isSaving]);

    /**
     * Resets the form. If editing an existing resume, it only clears the fields.
     * If creating a new one, it navigates to the base URL.
     */
    const handleReset = () => {
        resetResume(); // Clears the form data from context
        toast.success("Form cleared!");
        setStep(0);
        setShowPreview(false);

        // If creating a new resume, ensure the URL is clean.
        // If editing, we stay on the page and preserve the resumeId.
        if (!resumeId) {
            navigate('/resume-builder');
        }
    };
    
    /**
     * Checks if the resume data object has any content.
     */
    const isResumeEmpty = (data) => {
        if (!data) return true;
        const { personal_info, summary, skills, experience, projects, certifications, education } = data;
        const isPersonalInfoEmpty = !personal_info || Object.values(personal_info).every(val => !val || String(val).trim() === '');
        const isSummaryEmpty = !summary || summary.trim() === '';
        const areArraysEmpty = [skills, experience, projects, certifications, education].every(arr => !arr || arr.length === 0);
        return isPersonalInfoEmpty && isSummaryEmpty && areArraysEmpty;
    };

    const handleDelete = async () => {
        if (!resumeId) {
            toast.error("This resume hasn't been saved yet and cannot be deleted.");
            return;
        }

        if (window.confirm("Are you sure you want to permanently delete this resume? This action cannot be undone.")) {
            const toastId = "delete-resume";
            toast.loading("Deleting resume...", { id: toastId });
            try {
                await deleteResumeById(resumeId);
                toast.success("Resume deleted successfully!", { id: toastId });
                resetResume(); // Also clear the form from context
                navigate('/resume-homepage');
            } catch (error) {
                toast.error(`Failed to delete resume: ${error.message}`, { id: toastId });
            }
        }
    };

    const handleSaveOrUpdate = async () => {
        if (isResumeEmpty(resumeData)) {
            if (resumeId) {
                // If existing resume is cleared and saved, treat as a delete request
                handleDelete();
            } else {
                // Prevent saving a new, empty resume
                toast.error("Cannot save an empty resume.");
            }
            return;
        }

        setIsSaving(true);
        const toastId = "save-resume";
        toast.loading(resumeId ? "Updating resume..." : "Saving resume...", { id: toastId });

        try {
            const response = await saveResume(resumeData, resumeId); 
            if (response && response.resume_id) {
                toast.success(resumeId ? "Resume updated successfully!" : "Resume saved successfully!", { id: toastId });
                navigate('/resume-homepage'); 
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (e) {
            toast.error(`Failed to save resume: ${e.message}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!template) return toast.error("Pick a template first");
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            toast.loading("Generating PDF...", { id: "pdf-download" });
            const blob = await generateResumePDF(resumeData, template);
            
            const fullName = resumeData.personal_info?.full_name || "Resume";
            const filename = `Resume_${fullName.replace(/[^a-z0-9]/gi, '_')}.pdf`;

            downloadBlob(blob, filename);
            toast.success("PDF downloaded!", { id: "pdf-download" });
        } catch (e) {
            toast.error("PDF generation failed.", { id: "pdf-download" });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="resume-builder-page">
            <Toaster position="top-center" />

            <LeftColumn
                steps={steps}
                currentStep={step}
                onStepChange={setStep}
                template={template}
                onTemplateChange={setTemplate}
                templates={templates}
                isDownloading={isDownloading}
                onDownloadPdf={handleDownloadPdf}
                onReset={handleReset}
                onDelete={handleDelete}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
            />
            
            <EditorPanel
                steps={steps}
                currentStep={step}
                onStepChange={setStep}
                showPreview={showPreview}
                template={template}
                saved={saved}
                onSave={handleSaveOrUpdate}
                isSaving={isSaving}
                resumeId={resumeId}
                resumeData={resumeData}
                PreviewComponent={ResumePreview} 
            />
        </div>
    );
};

export default ResumeBuilder;