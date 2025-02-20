import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Progress {
  userId: string;
  courseId: string;
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
      // Atualiza o progresso específico na lista
      const index = state.userProgress.findIndex(
        (p) => p.courseId === action.payload.courseId
      );
      
      if (index >= 0) {
        state.userProgress[index] = action.payload;
      } else {
        state.userProgress.push(action.payload);
      }
      
      // Atualiza o progresso atual se for o mesmo curso
      if (state.currentProgress?.courseId === action.payload.courseId) {
        state.currentProgress = action.payload;
      }
    },
    fetchProgressFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
enrollCourse: (state, action: PayloadAction<string>) => {
  // Cria um novo progresso para o curso quando o usuário se matricula
  const courseId = action.payload;
  
  // Verifica se o usuário já está matriculado
  const existingProgress = state.userProgress.find(p => p.courseId === courseId);
  
  if (!existingProgress) {
    // Supondo que temos o userId disponível no state
    const userId = state.currentProgress?.userId || 'current-user-id';
    
    // Cria um novo progresso
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
}

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  setCurrentProgress,
  updateProgressSuccess,
  fetchProgressFail,
} = progressSlice.actions;

export default progressSlice.reducer;
