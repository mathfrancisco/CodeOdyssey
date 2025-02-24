import api from './api';
import { UserProfileResponse, UserUpdateRequest } from '../types/user';

const userService = {
  async getUserProfile() {
    const response = await api.get<UserProfileResponse>('/api/users/me');
    return response.data;
  },
  
  async updateUserProfile(userData: UserUpdateRequest) {
    const response = await api.put<UserProfileResponse>('/api/users/me', userData);
    return response.data;
  },
  
  async getUserEnrolledCourses() {
    const response = await api.get('/api/users/courses');
    return response.data;
  },
  
  async getUserProgress() {
    const response = await api.get('/api/users/progress');
    return response.data;
  },
  
  async getUserSubmissions() {
    const response = await api.get('/api/users/submissions');
    return response.data;
  },
  
  async getUserStats() {
    const response = await api.get('/api/users/stats');
    return response.data;
  },
  
  async getEnrolledCourses() {
    const response = await api.get('/api/users/courses');
    return response.data;
  },
  
  async checkLessonStatus(id: string) {
    const response = await api.get(`/api/users/lessons/${id}`);
    return response.data;
  },
  
  async markLessonComplete(id: string) {
    const response = await api.post(`/api/users/lessons/${id}/complete`);
    return response.data;
  },
  
  async updatePassword(current: string) {
    const response = await api.put('/api/users/password', { current });
    return response.data;
  }
};

export default userService;
