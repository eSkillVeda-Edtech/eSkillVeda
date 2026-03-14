import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Search, Calendar, Tag, Loader, AlertCircle,
  Trash2
} from 'lucide-react';
import './ResumeHomePage.css';
import { fetchResumes, generateResumePDF, downloadBlob, deleteResumeById } from '../../../../services/resumeAPI';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../../contexts/AuthContext.jsx';
import Pagination from '../../../../components/Pagination/Pagination';

const ResumeHomePage = () => {
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadResumes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchResumes();
        if (data && Array.isArray(data.resumes)) {
          const formattedResumes = data.resumes.map(resume => ({
            id: resume._id,
            name: resume.content?.personal_info?.full_name || 'Untitled Resume',
            jobTitle: resume.content?.targetRole || 'No target role',
            lastModified: resume.updated_at,
            tags: resume.content?.skills?.slice(0, 2) || [],
            fullData: resume.content,
            templateUsed: resume.content?.templateName || "Default",
          }));
          setResumes(formattedResumes);
        } else {
          setResumes([]);
        }
      } catch (e) {
        console.error("Failed to fetch resumes:", e);
        setError("Could not load resumes. Please ensure you are logged in.");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      loadResumes();
    } else if (!authLoading) {
      setLoading(false);
      setResumes([]);
      setError("You must be logged in to view your resumes.");
    }
  }, [isAuthenticated, authLoading]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- ADDED: Scroll to top when page changes ---
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  const handleCreateNew = () => navigate('/resume-builder', { state: { fromHomepage: true } });
  const handleEdit = (resumeId) => navigate(`/resume-builder?resume_id=${resumeId}`, { state: { fromHomepage: true } });

  const handleDownload = async (resume) => {
    const templateFileName = `${(resume.templateUsed || 'onyx').toLowerCase()}.html.j2`;
    toast.loading("Generating PDF...", { id: `pdf-${resume.id}` });
    try {
      const blob = await generateResumePDF(resume.fullData, templateFileName);
      const filename = `Resume_${(resume.name || 'Untitled').replace(/\s+/g, '_')}.pdf`;
      downloadBlob(blob, filename);
      toast.success("PDF Downloaded!", { id: `pdf-${resume.id}` });
    } catch (e) {
      toast.error("Could not generate PDF.", { id: `pdf-${resume.id}` });
    }
  };

  const handleDelete = async (resumeId) => {
    const originalResumes = [...resumes];
    setResumes(resumes.filter(r => r.id !== resumeId));
    try {
      await deleteResumeById(resumeId);
      toast.success("Resume deleted successfully!");
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error("Failed to delete resume. Reverting changes.");
      setResumes(originalResumes);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Simplified filtering logic
  const filteredResumes = useMemo(() => {
    if (!searchTerm) {
      return resumes;
    }
    return resumes.filter(r =>
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resumes, searchTerm]);

  // --- Simplified Pagination Logic ---
  const itemsPerPage = 5;

  const totalPages = useMemo(() => {
    // Standard calculation for total pages
    return Math.ceil(filteredResumes.length / itemsPerPage);
  }, [filteredResumes.length]);

  const paginatedResumes = useMemo(() => {
    // Standard logic to get the resumes for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredResumes.slice(startIndex, endIndex);
  }, [filteredResumes, currentPage]);


  const renderContent = () => {
    if (loading || authLoading) return <div className="loading-state"><Loader className="animate-spin" size={48} /><p>Loading...</p></div>;
    if (error) return <div className="error-state"><AlertCircle size={48} /><p>{error}</p></div>;
    if (resumes.length === 0 && !loading) return <div className="empty-placeholder">You have no resumes. Create one to get started!</div>;
    if (filteredResumes.length === 0 && !loading) return <div className="empty-placeholder">No resumes found for "{searchTerm}".</div>;

    return paginatedResumes.map((resume) => (
      <div key={resume.id} className="resume-card" tabIndex={0} onClick={() => handleEdit(resume.id)}>
        <div className="resume-card-header">
          <div className="resume-icon"><FileText size={22} /></div>
            <div className="resume-actions">
              <button title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(resume.id); }}><Trash2 size={16} /></button>
            </div>
        </div>
        <div className="resume-card-info">
          <div className="resume-title">{resume.name}</div>
          <div className="resume-details"><Calendar size={16} /> {formatDate(resume.lastModified)}</div>
          <div className="resume-tags">
            {resume.tags?.map(tag => <span key={tag} className="resume-tag"><Tag size={13} /> {tag}</span>)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="homepage-container">
      <Toaster position="top-center" />
      <div className="resumes-left-column">
        <div className="homepage-header">
          <div className="resumes-title">My Resumes</div>
          <div className="resumes-subtitle">Create, manage & export your resumes</div>
        </div>
        <div className="resumes-controls">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              className="resumes-search"
              placeholder="Search by name or job title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="resumes-right-column">
        <div className="resumes-grid">
          <div className="create-card" onClick={handleCreateNew} tabIndex={0}>
            <div className="create-content"><div className="plus-icon"><Plus size={32} /></div><p>Create new resume</p></div>
          </div>
          {renderContent()}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <Pagination 
              currentPage={currentPage}
              setPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHomePage;

