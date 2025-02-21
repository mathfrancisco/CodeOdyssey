import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Progress {
  userId: string;
  courseId: string;
  lessonId?: string;
  completedAt?: string;
  modulesProgress: any[];
  exercisesCompleted: string[];
  certificateIssued: boolean;
  certificateUrl?: string;
}

interface ProgressState {
  userProgress: Progress[];
  currentProgress: Progress | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  userProgress: [],
  currentProgress: null,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    fetchProgressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProgressSuccess: (state, action: PayloadAction<Progress[]>) => {
      state.userProgress = action.payload;
      state.loading = false;
    },
    setCurrentProgress: (state, action: PayloadAction<Progress>) => {
      state.currentProgress = action.payload;
    },
    updateProgressSuccess: (state, action: PayloadAction<Progress>) => {
      const index = state.userProgress.findIndex(
          (p) => p.courseId === action.payload.courseId && p.userId === action.payload.userId
      );

      if (index >= 0) {
        state.userProgress[index] = action.payload;
      } else {
        state.userProgress.push(action.payload);
      }

      if (state.currentProgress?.courseId === action.payload.courseId) {
        state.currentProgress = action.payload;
      }
    },
    fetchProgressFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    enrollCourse: (state, action: PayloadAction<{ courseId: string; userId: string }>) => {
      const { courseId, userId } = action.payload;

      const existingProgress = state.userProgress.find(
          p => p.courseId === courseId && p.userId === userId
      );

      if (!existingProgress) {
        const newProgress: Progress = {
          userId,
          courseId,
          modulesProgress: [],
          exercisesCompleted: [],
          certificateIssued: false
        };

        state.userProgress.push(newProgress);
        state.currentProgress = newProgress;
      }
    },
    clearProgress: (state) => {
      state.currentProgress = null;
      state.userProgress = [];
      state.error = null;
      state.loading = false;
    }
  },
});

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  setCurrentProgress,
  updateProgressSuccess,
  fetchProgressFail,
  enrollCourse,
  clearProgress
} = progressSlice.actions;

export default progressSlice.reducer;
