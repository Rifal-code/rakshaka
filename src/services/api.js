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

async function publicRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const json = await response.json();

  if (!response.ok || json.success === false) {
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }

  return json;
}

const normalizePublicReportsResponse = (response, page, perPage) => {
  const payload = response?.data ?? response;
  const reportList =
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload?.reports) && payload.reports) ||
    (Array.isArray(payload) && payload) ||
    [];

  const total = payload?.total ?? payload?.count ?? reportList.length;
  const normalizedData = {
    data: reportList,
    page: payload?.page ?? page,
    per_page: payload?.per_page ?? payload?.perPage ?? perPage,
    total,
    total_pages:
      payload?.total_pages ??
      payload?.totalPages ??
      Math.max(1, Math.ceil(total / perPage)),
  };

  return {
    ...response,
    success: response?.success ?? true,
    data: normalizedData,
  };
};

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

  getPublicReports: async (page = 1, perPage = 10) => {
    const query = `page=${page}&per_page=${perPage}`;
    const publicEndpoints = [
      `/reports/public?${query}`,
    ];
    let lastError = null;

    for (const endpoint of publicEndpoints) {
      try {
        const response = await publicRequest(endpoint, { method: 'GET' });
        return normalizePublicReportsResponse(response, page, perPage);
      } catch (error) {
        lastError = error;
        if (!/404|not found/i.test(error.message)) {
          throw error;
        }
      }
    }

    throw lastError || new Error('Public reports endpoint is not available');
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
