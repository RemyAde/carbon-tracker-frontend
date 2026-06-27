const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
}

// Auth service
export const authService = {
  async register(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    
    const data = await handleResponse(response);
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

// Activities service
export const activitiesService = {
  async getAll() {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/activities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async create(activityData) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });
    return handleResponse(response);
  },

  async delete(id) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete activity');
    }
    return true;
  },

  async getTypes() {
    const response = await fetch(`${API_BASE_URL}/activities/types`);
    return handleResponse(response);
  },
};

// Analytics service
export const analyticsService = {
  async getSummary(period = 'week') {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/analytics/summary?period=${period}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async getTrends(period = 'week') {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/analytics/trends?period=${period}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },
};