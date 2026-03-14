import axios from 'axios';
import { RESUME_API_BASE } from '../services/api';

const cache = new Map(); // key: template name (.html.j2), value: { name, html, css }

function normalizeName(name) {
  return name?.endsWith('.html.j2') ? name : `${name}.html.j2`;
}

export async function fetchTemplateSource(name) {
  const n = normalizeName(name);
  if (cache.has(n)) return cache.get(n);
  const res = await axios.get(`${RESUME_API_BASE}/templates/${encodeURIComponent(n)}`);
  cache.set(n, res.data);
  return res.data;
}

export function clearTemplateCache() {
  cache.clear();
}
