import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  _id: string;
  title: string;
  description: string;
  level: string;
  technologies: string[];
  instructor: any;
  modules: any[];
  enrolledCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
    },
    fetchCoursesFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFail,
  setCurrentCourse,
  clearCurrentCourse,
} = coursesSlice.actions;

export default coursesSlice.reducer;
