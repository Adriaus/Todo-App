import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Axios-Instanz für alle Requests
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // <- wichtig für Cookies
});

// Auth-Token aus localStorage in Header setzen (falls JWT im Header)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  async login(username: string, password: string) {
    const response = await apiClient.post('/api/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  async register(email: string, username: string, password: string, full_name?: string) {
    const response = await apiClient.post('/api/auth/register', {
      email,
      username,
      password,
      full_name,
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};

export const userApi = {
  async getUsers() {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  async getUser(userId: number) {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  },
};

export const teamApi = {
  async getTeams() {
    const response = await apiClient.get('/api/teams');
    return response.data;
  },

  async createTeam(name: string, description?: string) {
    const response = await apiClient.post('/api/teams', {
      name,
      description,
    });
    return response.data;
  },

  async addTeamMember(teamId: number, userId: number) {
    const response = await apiClient.post(`/api/teams/${teamId}/members/${userId}`);
    return response.data;
  },
};

export { apiClient };
