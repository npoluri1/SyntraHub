const API = process.env.REACT_APP_API_URL || '';

export const api = async (endpoint, options = {}) => {
  const url = `${API}${endpoint}`;
  const token = localStorage.getItem('auth_token');
  
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };

  if (options.isFormData) {
    // Let fetch set the boundary and content-type for FormData
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
