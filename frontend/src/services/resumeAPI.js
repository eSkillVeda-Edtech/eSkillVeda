import axios from 'axios';
import { RESUME_API_BASE } from '../services/api';
import DOMPurify from 'dompurify';

// This is the standardized helper function I recommended.
// It centralizes token logic.
async function apiFetch(endpoint, options = {}) {
    const authToken = localStorage.getItem('auth_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
        method: options.method || 'GET',
        url: `${RESUME_API_BASE}${endpoint}`,
        headers: headers,
        data: options.body,
        responseType: options.responseType,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error("API Fetch Error:", error.response || error.message);
        const errorMsg = error.response?.data?.detail || error.message || "An unknown error occurred.";
        throw new Error(errorMsg);
    }
}


export function toBackendResumePayload(resumeData, templateName) {
    const contact = {
        Name: resumeData?.personal_info?.full_name || '',
        Email: resumeData?.personal_info?.email || '',
        Phone: resumeData?.personal_info?.phone_number || '',
        LinkedIn: resumeData?.personal_info?.linkedin_url || '',
    };
	const summaryArray = Array.isArray(resumeData?.summary)
		? resumeData.summary.filter(Boolean).map(s => sanitizeKeepFormatting(s))
		: (resumeData?.summary ? [sanitizeKeepFormatting(String(resumeData.summary))] : []);
	const skills = Array.isArray(resumeData?.skills) ? resumeData.skills.filter(Boolean) : [];
	const experience = (resumeData?.experience || []).map((e) => ({
		Role: e.title || '',
		Company: e.company || '',
		Duration: [e.startDate, e.endDate].filter(Boolean).join(' - '),
		Description: Array.isArray(e.description)
			? e.description.map(d => sanitizeKeepFormatting(d))
			: (typeof e.description === 'string' && e.description)
				? htmlToBulletItemsPreservingFormatting(e.description)
				: [],
	}));
	const projects = (resumeData?.projects || []).map((p) => ({
		Name: p.name || '',
		Year: '',
		Description: Array.isArray(p.description)
			? p.description.map(d => sanitizeKeepFormatting(d))
			: (typeof p.description === 'string' && p.description)
				? htmlToBulletItemsPreservingFormatting(p.description)
				: [],
	}));
	const education = (resumeData?.education || []).map((edu) => ({
		Degree: edu.degree || '',
		Institute: edu.institute || '',
		Year: edu.graduationDate || '',
	}));
	const certification = Array.isArray(resumeData?.certifications)
		? resumeData.certifications.filter(Boolean)
		: [];
	const payload = {
		Contact: contact,
		Summary: summaryArray,
		Skills: skills,
		Experience: experience,
		Projects: projects,
		Education: education,
		Certification: certification,
		TargetRole: resumeData?.targetRole || '',
	};
	if (templateName) payload.template_name = templateName;
	return payload;
}

function sanitizeKeepFormatting(html) {
	const allowed = {
		ALLOWED_TAGS: ['b','strong','i','em','u','s','strike','ul','ol','li','p','br','div','span','a'],
		ALLOWED_ATTR: ['href','target','rel','class','style']
	};
	return DOMPurify.sanitize(String(html || ''), allowed);
}

function htmlToBulletItemsPreservingFormatting(html) {
	const div = document.createElement('div');
	div.innerHTML = String(html || '');
	const lis = Array.from(div.querySelectorAll('li')).map(li => sanitizeKeepFormatting(li.innerHTML)).filter(Boolean);
	if (lis.length) return lis;
	const parts = String(html || '')
		.split(/<br\s*\/?>|\n+/i)
		.map(s => s.trim())
		.filter(Boolean)
		.map(s => sanitizeKeepFormatting(s));
	if (parts.length === 0 && html) return [sanitizeKeepFormatting(html)];
	return parts;
}

export async function fetchTemplates() {
	return apiFetch('/templates');
}

export async function generateResumePDF(resumeData, templateName) {
    const payload = toBackendResumePayload(resumeData, templateName);
    return apiFetch('/generate-resume/', {
        method: 'POST',
        body: payload,
        responseType: 'blob',
    });
}

export function downloadBlob(blob, filename) {
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => window.URL.revokeObjectURL(url), 5000);
}

// ✅ NEW: Function to get all resumes for the logged-in user.
export async function fetchResumes() {
    return apiFetch('/resumes');
}

export async function saveResume(resumeData, resumeId = null) {
    const method = resumeId ? 'PUT' : 'POST';
    const endpoint = resumeId ? `/resumes/${resumeId}` : '/resumes';
    const payload = { content: resumeData };

    return apiFetch(endpoint, {
        method: method,
        body: payload,
    });
}

export async function getResumeById(resumeId) {
    return apiFetch(`/resumes/${resumeId}`);
}

export async function deleteResumeById(resumeId) {
    return apiFetch(`/resumes/${resumeId}`, {
        method: 'DELETE',
    });
}

