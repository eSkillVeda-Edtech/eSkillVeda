import { useResume } from "../../context/useResume";
import RichTextEditor from '../TextEditorComponent/RichTextEditor';
import toast from "react-hot-toast";
import './Forms.css';

const SummaryForm = () => {
  const { resumeData, setResumeData } = useResume();

  const handleSummaryChange = (value) => {
    // ✅ FIXED: Use functional update to avoid stale state.
    setResumeData(prevData => ({ ...prevData, summary: value }));
  };

  const handleTargetRoleChange = (e) => {
    // ✅ FIXED: Use functional update.
    setResumeData(prevData => ({ ...prevData, targetRole: e.target.value }));
  };

  const isFormComplete = () => {
    const hasSkills = resumeData.skills?.some(skill => skill?.trim());
    const hasSufficientData = 
      resumeData.experience?.some(exp => exp.company?.trim()) ||
      resumeData.projects?.some(proj => proj.name?.trim()) ||
      resumeData.education?.some(edu => edu.institute?.trim());
    
    return hasSkills && hasSufficientData;
  };

  const summaryPayload = {
    skills: resumeData.skills,
    experience: resumeData.experience,
    projects: resumeData.projects,
    education: resumeData.education,
    targetRole: resumeData.targetRole,
    user_prompt: resumeData.summary,
  };

  return (
    <div className="form-section">
      <div className="form-card unified-form-card">
        <div className="form-main-content">

          {/* ✅ REMOVED: Standardized title has been taken out. */}

          <div className="form-group">
            <label htmlFor="targetRole">Target Role (Optional)</label>
            <input
              id="targetRole"
              type="text"
              className="form-input"
              value={resumeData.targetRole || ''}
              onChange={handleTargetRoleChange}
              placeholder="e.g. Software Engineer, Marketing Manager"
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <RichTextEditor
              value={resumeData.summary || ''}
              onChange={handleSummaryChange}
              placeholder="✨ AI will only work after adding skills along with anyone of Experience/Projects/Education"
              enhancerType="summary"
              formData={summaryPayload}
              isFormComplete={isFormComplete}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SummaryForm;