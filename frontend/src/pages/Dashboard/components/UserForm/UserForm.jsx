import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { 
  User, Phone, MapPin, Briefcase, Link, Save, X, Plus, Trash2, 
  Award, GraduationCap, Code, FileText, CheckCircle, 
  ChevronLeft, ChevronRight, Loader2, Menu, Edit3
} from 'lucide-react';
import RichTextEditor from '../../../AI-Tool/AI-Resume-Builder/components/TextEditorComponent/RichTextEditor';
import './UserForm.css';

const UserForm = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    linkedin: '',
    portfolio: '',
    bio: '',
    // Experience
    experience: [],
    // Education
    education: [],
    // Projects
    projects: [],
    // Skills
    skills: [],
    // Certifications
    certifications: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        jobTitle: user.jobTitle || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
        bio: user.bio || '',
        experience: user.experience || [],
        education: user.education || [],
        projects: user.projects || [],
        skills: user.skills || [],
        certifications: user.certifications || []
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleArrayAdd = (arrayName, newItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
    setHasUnsavedChanges(true);
  };

  const handleArrayUpdate = (arrayName, index, updatedItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? updatedItem : item)
    }));
    setHasUnsavedChanges(true);
  };

  const handleArrayDelete = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUser(formData);
      setSuccess('Profile updated successfully!');
      setHasUnsavedChanges(false);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Updated tabs without summary section
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handlePrevTab = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  // Panel management functions
  const handleAddNew = (arrayName) => {
    setIsAddingNew(true);
    setEditingIndex(-1);
    setIsPanelOpen(true);
  };

  const handleEdit = (arrayName, index) => {
    setEditingIndex(index);
    setIsAddingNew(true);
    setIsPanelOpen(false);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingIndex(-1);
    setIsPanelOpen(false);
  };

  // Experience Form Component
  const ExperienceForm = ({ experience, onUpdate, onDelete, isNew = false }) => {
    const [exp, setExp] = useState(experience || {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });

    const handleSave = () => {
      if (!exp.title || !exp.company) {
        alert('Please fill in required fields (Job Title and Company)');
        return;
      }
      onUpdate(exp);
      if (isNew) {
        setIsAddingNew(false);
      }
    };

    return (
      <div className="uf-panel-item">
        <div className="uf-panel-item-content">
          <div className="uf-form-row uf-two-columns">
            <div className="uf-form-group">
              <label>Job Title *</label>
              <input
                type="text"
                className="uf-form-input"
                value={exp.title}
                onChange={(e) => setExp({...exp, title: e.target.value})}
                placeholder="Software Engineer"
              />
            </div>
            <div className="uf-form-group">
              <label>Company *</label>
              <input
                type="text"
                className="uf-form-input"
                value={exp.company}
                onChange={(e) => setExp({...exp, company: e.target.value})}
                placeholder="Tech Corp Inc."
              />
            </div>
          </div>

          <div className="uf-form-row uf-three-columns">
            <div className="uf-form-group">
              <label>Location</label>
              <input
                type="text"
                className="uf-form-input"
                value={exp.location}
                onChange={(e) => setExp({...exp, location: e.target.value})}
                placeholder="New York, NY"
              />
            </div>
            <div className="uf-form-group">
              <label>Start Date</label>
              <input
                type="month"
                className="uf-form-input"
                value={exp.startDate}
                onChange={(e) => setExp({...exp, startDate: e.target.value})}
              />
            </div>
            <div className="uf-form-group">
              <label>End Date</label>
              <input
                type="month"
                className="uf-form-input"
                value={exp.endDate}
                onChange={(e) => setExp({...exp, endDate: e.target.value})}
                placeholder="Leave empty if current"
              />
            </div>
          </div>

          <div className="uf-form-group">
            <label>Job Description</label>
            <RichTextEditor
              value={exp.description}
              onChange={(value) => setExp({...exp, description: value})}
              placeholder="Describe your responsibilities, achievements, and key contributions..."
            />
          </div>

          <div className="uf-form-actions">
            <button type="button" onClick={handleSave} className="uf-btn">
              <Save size={16} />
              Save Experience
            </button>
            {isNew && (
              <button type="button" onClick={handleCancel} className="uf-btn" style={{background: 'var(--uf-text-secondary)'}}>
                <X size={16} />
                Cancel
              </button>
            )}
            {onDelete && !isNew && (
              <button type="button" onClick={onDelete} className="uf-remove-btn">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Education Form Component
  const EducationForm = ({ education, onUpdate, onDelete, isNew = false }) => {
    const [edu, setEdu] = useState(education || {
      institute: '',
      degree: '',
      graduationDate: ''
    });

    const handleSave = () => {
      if (!edu.degree || !edu.institute) {
        alert('Please fill in required fields (Degree and Institute)');
        return;
      }
      onUpdate(edu);
      if (isNew) {
        setIsAddingNew(false);
      }
    };

    return (
      <div className="uf-panel-item">
        <div className="uf-panel-item-content">
          <div className="uf-form-row uf-two-columns">
            <div className="uf-form-group">
              <label>Institute *</label>
              <input
                type="text"
                className="uf-form-input"
                value={edu.institute}
                onChange={(e) => setEdu({...edu, institute: e.target.value})}
                placeholder="University of Technology"
              />
            </div>
            <div className="uf-form-group">
              <label>Degree *</label>
              <input
                type="text"
                className="uf-form-input"
                value={edu.degree}
                onChange={(e) => setEdu({...edu, degree: e.target.value})}
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
          </div>

          <div className="uf-form-group">
            <label>Graduation Date</label>
            <input
              type="month"
              className="uf-form-input"
              value={edu.graduationDate}
              onChange={(e) => setEdu({...edu, graduationDate: e.target.value})}
            />
          </div>

          <div className="uf-form-actions">
            <button type="button" onClick={handleSave} className="uf-btn">
              <Save size={16} />
              Save Education
            </button>
            {isNew && (
              <button type="button" onClick={handleCancel} className="uf-btn" style={{background: 'var(--uf-text-secondary)'}}>
                <X size={16} />
                Cancel
              </button>
            )}
            {onDelete && !isNew && (
              <button type="button" onClick={onDelete} className="uf-remove-btn">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Projects Form Component
  const ProjectForm = ({ project, onUpdate, onDelete, isNew = false }) => {
    const [proj, setProj] = useState(project || {
      name: '',
      description: ''
    });

    const handleSave = () => {
      if (!proj.name) {
        alert('Please fill in the project name');
        return;
      }
      onUpdate(proj);
      if (isNew) {
        setIsAddingNew(false);
      }
    };

    return (
      <div className="uf-panel-item">
        <div className="uf-panel-item-content">
          <div className="uf-form-group">
            <label>Project Name *</label>
            <input
              type="text"
              className="uf-form-input"
              value={proj.name}
              onChange={(e) => setProj({...proj, name: e.target.value})}
              placeholder="E-commerce Website"
            />
          </div>

          <div className="uf-form-group">
            <label>Project Description</label>
            <RichTextEditor
              value={proj.description}
              onChange={(value) => setProj({...proj, description: value})}
              placeholder="Describe your project, technologies used, and key achievements..."
            />
          </div>

          <div className="uf-form-actions">
            <button type="button" onClick={handleSave} className="uf-btn">
              <Save size={16} />
              Save Project
            </button>
            {isNew && (
              <button type="button" onClick={handleCancel} className="uf-btn" style={{background: 'var(--uf-text-secondary)'}}>
                <X size={16} />
                Cancel
              </button>
            )}
            {onDelete && !isNew && (
              <button type="button" onClick={onDelete} className="uf-remove-btn">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Certifications Form Component
  const CertificationForm = ({ certification, onUpdate, onDelete, isNew = false }) => {
    const [cert, setCert] = useState(certification || '');

    const handleSave = () => {
      if (!cert.trim()) {
        alert('Please enter a certification name');
        return;
      }
      onUpdate(cert);
      if (isNew) {
        setIsAddingNew(false);
      }
    };

    return (
      <div className="uf-panel-item">
        <div className="uf-panel-item-content">
          <div className="uf-form-group">
            <label>Certification Name *</label>
            <input
              type="text"
              className="uf-form-input"
              value={cert}
              onChange={(e) => setCert(e.target.value)}
              placeholder="AWS Certified Solutions Architect"
            />
          </div>

          <div className="uf-form-actions">
            <button type="button" onClick={handleSave} className="uf-btn">
              <Save size={16} />
              Save Certification
            </button>
            {isNew && (
              <button type="button" onClick={handleCancel} className="uf-btn" style={{background: 'var(--uf-text-secondary)'}}>
                <X size={16} />
                Cancel
              </button>
            )}
            {onDelete && !isNew && (
              <button type="button" onClick={onDelete} className="uf-remove-btn">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render sidebar panel for items list
  const renderSidebar = (arrayName) => {
    const items = formData[arrayName];
    const titles = {
      experience: 'Experience Items',
      education: 'Education Items',
      projects: 'Project Items',
      certifications: 'Certifications'
    };

    return (
      <div className={`uf-sliding-panel ${isPanelOpen ? 'uf-open' : ''}`}>
        <div className="uf-panel-header">
          <h4>{titles[arrayName]}</h4>
          <button
            type="button"
            className="uf-panel-close"
            onClick={() => setIsPanelOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="uf-panel-content">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--uf-text-secondary)' }}>
              <p>No items added yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item, index) => (
                <div key={index} className="uf-panel-item">
                  <div className="uf-panel-item-content">
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {arrayName === 'experience' ? item.title :
                       arrayName === 'education' ? item.degree :
                       arrayName === 'projects' ? item.name :
                       item}
                    </div>
                    {arrayName !== 'certifications' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--uf-text-secondary)' }}>
                        {arrayName === 'experience' ? item.company :
                         arrayName === 'education' ? item.institute :
                         arrayName === 'projects' ? 'Project' : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(arrayName, index)}
                      style={{ 
                        width: '32px', height: '32px', border: 'none', 
                        background: 'transparent', borderRadius: '0.375rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--uf-primary-blue)'
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArrayDelete(arrayName, index)}
                      style={{ 
                        width: '32px', height: '32px', border: 'none', 
                        background: 'transparent', borderRadius: '0.375rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--uf-text-secondary)'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="uf-section">
            <div className="uf-section-title">
              <h4>Personal Information</h4>
            </div>

            <div className="uf-form-row uf-two-columns">
              <div className="uf-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="uf-form-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="uf-form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="uf-form-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div className="uf-form-row uf-two-columns">
              <div className="uf-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="uf-form-input"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="uf-form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="uf-form-input"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="New York, NY, USA"
                />
              </div>
            </div>

            <div className="uf-form-row uf-two-columns">
              <div className="uf-form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  className="uf-form-input"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div className="uf-form-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  className="uf-form-input"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="uf-form-group">
              <label>Portfolio Website</label>
              <input
                type="url"
                className="uf-form-input"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="uf-form-group">
              <label>Professional Bio</label>
              <textarea
                className="uf-form-input"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Write a brief professional bio that highlights your expertise and experience..."
                rows={4}
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="uf-section">
            <div className="uf-section-title">
              <h4>Work Experience ({formData.experience.length})</h4>
            </div>

            {formData.experience.length === 0 ? (
              <div className="uf-placeholder">
                <div className="uf-placeholder-content">
                  <h4>No Work Experience Added</h4>
                  <p>Start building your professional profile by adding your work experience, internships, and career highlights.</p>
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('experience', {
                      title: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      description: ''
                    })}
                    className="uf-btn uf-btn-large"
                  >
                    Add Your Experience
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAddNew('experience')}
                    className="uf-btn"
                  >
                    Add Experience
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(true)}
                    className="uf-panel-toggle"
                  >
                    <Menu size={20} />
                  </button>
                </div>

                {(isAddingNew || editingIndex >= 0) && (
                  <ExperienceForm
                    experience={editingIndex >= 0 ? formData.experience[editingIndex] : null}
                    onUpdate={(updated) => {
                      if (editingIndex >= 0) {
                        handleArrayUpdate('experience', editingIndex, updated);
                        setEditingIndex(-1);
                      } else {
                        handleArrayAdd('experience', updated);
                      }
                    }}
                    isNew={isAddingNew && editingIndex < 0}
                  />
                )}

                {!isAddingNew && editingIndex < 0 && formData.experience.map((exp, index) => (
                  <div key={index} className="uf-panel-item">
                    <div className="uf-panel-item-content">
                      <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {exp.title} at {exp.company}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--uf-text-secondary)' }}>
                        {exp.location && `${exp.location} • `}
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit('experience', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-primary-blue)'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayDelete('experience', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-text-secondary)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case 'education':
        return (
          <div className="uf-section">
            <div className="uf-section-title">
              <h4>Education ({formData.education.length})</h4>
            </div>

            {formData.education.length === 0 ? (
              <div className="uf-placeholder">
                <div className="uf-placeholder-content">
                  <h4>No Education Added</h4>
                  <p>Add your educational background, degrees, and academic achievements.</p>
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('education', {
                      institute: '',
                      degree: '',
                      graduationDate: ''
                    })}
                    className="uf-btn uf-btn-large"
                  >
                    Add Education
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAddNew('education')}
                    className="uf-btn"
                  >
                    Add Education
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(true)}
                    className="uf-panel-toggle"
                  >
                    <Menu size={20} />
                  </button>
                </div>

                {(isAddingNew || editingIndex >= 0) && (
                  <EducationForm
                    education={editingIndex >= 0 ? formData.education[editingIndex] : null}
                    onUpdate={(updated) => {
                      if (editingIndex >= 0) {
                        handleArrayUpdate('education', editingIndex, updated);
                        setEditingIndex(-1);
                      } else {
                        handleArrayAdd('education', updated);
                      }
                    }}
                    isNew={isAddingNew && editingIndex < 0}
                  />
                )}

                {!isAddingNew && editingIndex < 0 && formData.education.map((edu, index) => (
                  <div key={index} className="uf-panel-item">
                    <div className="uf-panel-item-content">
                      <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {edu.degree}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--uf-text-secondary)' }}>
                        {edu.institute}
                        {edu.graduationDate && ` • ${edu.graduationDate}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit('education', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-primary-blue)'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayDelete('education', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-text-secondary)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="uf-section">
            <div className="uf-section-title">
              <h4>Projects ({formData.projects.length})</h4>
            </div>

            {formData.projects.length === 0 ? (
              <div className="uf-placeholder">
                <div className="uf-placeholder-content">
                  <h4>No Projects Added</h4>
                  <p>Showcase your personal projects, contributions, and development work.</p>
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('projects', {
                      name: '',
                      description: ''
                    })}
                    className="uf-btn uf-btn-large"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAddNew('projects')}
                    className="uf-btn"
                  >
                    Add Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(true)}
                    className="uf-panel-toggle"
                  >
                    <Menu size={20} />
                  </button>
                </div>

                {(isAddingNew || editingIndex >= 0) && (
                  <ProjectForm
                    project={editingIndex >= 0 ? formData.projects[editingIndex] : null}
                    onUpdate={(updated) => {
                      if (editingIndex >= 0) {
                        handleArrayUpdate('projects', editingIndex, updated);
                        setEditingIndex(-1);
                      } else {
                        handleArrayAdd('projects', updated);
                      }
                    }}
                    isNew={isAddingNew && editingIndex < 0}
                  />
                )}

                {!isAddingNew && editingIndex < 0 && formData.projects.map((project, index) => (
                  <div key={index} className="uf-panel-item">
                    <div className="uf-panel-item-content">
                      <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {project.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--uf-text-secondary)' }}>
                        {project.description ? 'Project with description' : 'No description'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit('projects', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-primary-blue)'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayDelete('projects', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-text-secondary)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case 'certifications':
        return (
          <div className="uf-section">
            <div className="uf-section-title">
              <h4>Certifications ({formData.certifications.length})</h4>
            </div>

            {formData.certifications.length === 0 ? (
              <div className="uf-placeholder">
                <div className="uf-placeholder-content">
                  <h4>No Certifications Added</h4>
                  <p>Add your professional certifications, licenses, and credentials.</p>
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('certifications', '')}
                    className="uf-btn uf-btn-large"
                  >
                    Add Certification
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAddNew('certifications')}
                    className="uf-btn"
                  >
                    Add Certification
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(true)}
                    className="uf-panel-toggle"
                  >
                    <Menu size={20} />
                  </button>
                </div>

                {(isAddingNew || editingIndex >= 0) && (
                  <CertificationForm
                    certification={editingIndex >= 0 ? formData.certifications[editingIndex] : null}
                    onUpdate={(updated) => {
                      if (editingIndex >= 0) {
                        handleArrayUpdate('certifications', editingIndex, updated);
                        setEditingIndex(-1);
                      } else {
                        handleArrayAdd('certifications', updated);
                      }
                    }}
                    isNew={isAddingNew && editingIndex < 0}
                  />
                )}

                {!isAddingNew && editingIndex < 0 && formData.certifications.map((cert, index) => (
                  <div key={index} className="uf-panel-item">
                    <div className="uf-panel-item-content">
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                        {cert}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit('certifications', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-primary-blue)'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArrayDelete('certifications', index)}
                        style={{ 
                          width: '32px', height: '32px', border: 'none', 
                          background: 'transparent', borderRadius: '0.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--uf-text-secondary)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="uf-section">
            <div className="uf-section-title">
              <h4>Skills & Expertise</h4>
            </div>

            <div className="uf-skills-input">
              <div className="uf-skills-row">
                <div className="uf-form-group uf-skills-search">
                  <label>Add Skills</label>
                  <input
                    type="text"
                    className="uf-form-input"
                    placeholder="Type a skill and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const skill = e.target.value.trim();
                        if (!formData.skills.includes(skill)) {
                          handleArrayAdd('skills', skill);
                        }
                        e.target.value = '';
                      }
                    }}
                  />
                </div>

                <div className="uf-form-group uf-skills-add">
                  <button
                    type="button"
                    className="uf-btn"
                    onClick={() => {
                      const input = document.querySelector('.uf-skills-search input');
                      const skill = input.value.trim();
                      if (skill && !formData.skills.includes(skill)) {
                        handleArrayAdd('skills', skill);
                        input.value = '';
                      }
                    }}
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            <div className="uf-skills-divider">
              <div className="uf-divider-line"></div>
              <span className="uf-divider-text">Your Skills ({formData.skills.length})</span>
              <div className="uf-divider-line"></div>
            </div>

            <div className="uf-skills-display">
              {formData.skills.length === 0 ? (
                <div className="uf-skills-placeholder">
                  <p>Added skills will appear here.</p>
                </div>
              ) : (
                <div className="uf-skills-list">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="uf-skill-chip">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayDelete('skills', index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="uf-user-form-page">
      {/* Left Column - Tab Navigation */}
      <div className="uf-left-column">
        <div className="uf-header">
          <h1 className="uf-title">Edit Profile</h1>
          <p className="uf-subtitle">Update your professional information and build your profile.</p>
        </div>

        <div className="uf-controls">
          <div className="uf-tab-navigation">
            <h3 className="uf-tab-navigation-title">Profile Sections</h3>
            <div className="uf-tab-list">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`uf-tab-btn ${activeTab === tab.id ? 'uf-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && <CheckCircle className="uf-tab-check" size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Content */}
      <div className="uf-right-column">
        <div className="uf-content-container">
          {/* Header with Navigation */}
          <div className="uf-form-header">
            <h2 className="uf-form-title">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <div className="uf-form-meta">
              <span className="uf-step-counter">
                Step {currentTabIndex + 1} of {tabs.length}
              </span>
            </div>
            <div className="uf-header-actions">
              <div className="uf-nav-controls">
                {/* Save button */}
                <button 
                  onClick={handleSave} 
                  disabled={loading} 
                  className="uf-nav-btn uf-save" 
                  title="Save Changes"
                >
                  {loading ? <Loader2 size={20} className="uf-animate-spin" /> : <Save size={20} />}
                </button>

                {/* Previous Button */}
                <button
                  onClick={handlePrevTab}
                  disabled={isFirstTab || loading}
                  className="uf-nav-btn uf-prev"
                  title="Previous Step"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Next Button */}
                {!isLastTab && (
                  <button
                    onClick={handleNextTab}
                    disabled={isLastTab || loading}
                    className="uf-nav-btn uf-next"
                    title="Next Step"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}

                {/* Close Button */}
                <button onClick={handleClose} className="uf-nav-btn" title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && <div className="uf-error-message">{error}</div>}
          {success && <div className="uf-success-message">{success}</div>}

          {/* Form Content */}
          <div className="uf-form-content">
            <div className="uf-unified-card">
              <div className={`uf-main-content ${isPanelOpen ? 'uf-panel-open' : ''}`}>
                {renderTabContent()}
              </div>

              {/* Render sidebar for array sections */}
              {['experience', 'education', 'projects', 'certifications'].includes(activeTab) && 
               renderSidebar(activeTab)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;