// Try environment variable, fall back to production URL, then to relative path
const API = process.env.REACT_APP_API_URL || 'https://syntrahub.onrender.com';

export const api = async (endpoint, options = {}) => {
  // If the endpoint is already absolute, don't prepend API
  const url = endpoint.startsWith('http') ? endpoint : `${API}${endpoint}`;
  const token = localStorage.getItem('auth_token');
  
  const headers = { ...options.headers };
  
  // Only add Authorization if it's not a multipart request or if the backend expects it 
  // (Standard OAuth2 expects it even for login form-data, but be careful with Content-Type)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };

  if (options.isFormData) {
    // DO NOT set Content-Type header if using FormData, 
    // fetch will automatically set it to 'multipart/form-data' with boundary
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type'] && config.body) {
    config.headers['Content-Type'] = 'application/json';
  }

  const resp = await fetch(url, config);
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err);
  }
  return resp.json();
};

export const API_URL = API;
export default api;
