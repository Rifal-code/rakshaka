const BASE_URL = import.meta.env.VITE_API_URL || 'https://rakshaka-api-745564405904.asia-southeast1.run.app';

/**
 * Common request fetcher helper
 * @param {string} endpoint 
 * @param {object} options 
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('rakshaka_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const json = await response.json();
    
    if (!response.ok || json.success === false) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }
    
    return json;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth API
  register: (username, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: () => {
    return request('/auth/me', {
      method: 'GET',
    });
  },

  // Report API
  getReports: (page = 1, perPage = 10) => {
    return request(`/reports?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    });
  },

  getReport: (id) => {
    return request(`/reports/${id}`, {
      method: 'GET',
    });
  },

  createReport: (reportData) => {
    // reportData: { title, description, category, images }
    return request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  updateReport: (id, reportData) => {
    // reportData: { title, description, category, images }
    return request(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  },

  deleteReport: (id) => {
    return request(`/reports/${id}`, {
      method: 'DELETE',
    });
  },

  // Link Checker API
  checkLink: (url) => {
    return request('/link/check', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },
};
