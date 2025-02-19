import api from './api';
import { UserProfileResponse, UserUpdateRequest } from '../types/user';

const userService = {
  async getUserProfile() {
    const response = await api.get<UserProfileResponse>('/users/profile');
    return response.data;
  },

  async updateUserProfile(userData: UserUpdateRequest) {
    const response = await api.put<UserProfileResponse>('/users/profile', userData);
    return response.data;
  },

  async getUserEnrolledCourses() {
    const response = await api.get('/users/courses');
    return response.data;
  },

  async getUserProgress() {
    const response = await api.get('/users/progress');
    return response.data;
  },

  async getUserSubmissions() {
    const response = await api.get('/users/submissions');
    return response.data;
  }
};

export default userService;
