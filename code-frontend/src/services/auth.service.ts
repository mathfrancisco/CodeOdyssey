import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const authService = {
  async login(credentials: LoginCredentials) {
    console.log('Attempting login with:', credentials);
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async register(data: RegisterData) {
    const response = await api.post('/api/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },
  
  logout() {
    localStorage.removeItem('token');
  },
  
  async updateProfile(data: any) {
    const response = await api.put('/api/users/me', data);
    return response.data;
  },
};

export default authService;
