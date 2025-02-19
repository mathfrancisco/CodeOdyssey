import api from './api';

const coursesService = {
  async getAllCourses() {
    const response = await api.get('/courses');
    return response.data;
  },

  async getCourseById(id: string) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async enrollInCourse(courseId: string) {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  async getCourseLessons(courseId: string) {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  async getLessonById(courseId: string, lessonId: string) {
    const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  async submitExercise(exerciseId: string, code: string, language: string) {
    const response = await api.post(`/exercises/${exerciseId}/submit`, {
      code,
      language
    });
    return response.data;
  },

  async getUserProgress(courseId: string) {
    const response = await api.get(`/progress/course/${courseId}`);
    return response.data;
  }
};

export default coursesService;
