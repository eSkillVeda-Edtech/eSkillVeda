// Basic API base URLs for local dev. Adjust for production as needed.
export const RESUME_API_BASE = import.meta.env.VITE_RESUME_API_BASE || 'http://127.0.0.1:8000';
// Auth service base URL (Express on Node). Defaults to localhost:5000
export const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE || 'http://localhost:5000';