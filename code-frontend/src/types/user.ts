export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profile: {
    avatar?: string;
    bio?: string;
    socialLinks?: {
      type: string;
      url: string;
    }[];
  };
  preferences?: Record<string, any>;
  createdAt: string;
  lastLogin: string;
}

export interface UserUpdateData {
  name?: string;
  profile?: {
    avatar?: string;
    bio?: string;
    socialLinks?: {
      type: string;
      url: string;
    }[];
  };
  preferences?: Record<string, any>;
}

export interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  exercisesCompleted: number;
  totalPoints: number;
  streak: number;
  averageScore: number;
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// User Profile Types and Interfaces
export type UserRole = 'student' | 'instructor' | 'admin';

export interface SocialLink {
  type: string;
  url: string;
}

export interface UserPreferences {
  emailNotifications?: boolean;
  darkMode?: boolean;
  language?: string;
  timezone?: string;
  [key: string]: any; // Allow for dynamic preferences
}


export interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  exercisesCompleted: number;
  totalPoints: number;
  streak: number;
  averageScore: number;
}

export class UserUpdateRequest {
  constructor(data: UserUpdateData) {
    Object.assign(this, data);
  }

}export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profile: {
    avatar?: string;
    bio?: string;
    socialLinks?: {
      type: string;
      url: string;
    }[];
  };
  preferences?: Record<string, any>;
  createdAt: string;
  lastLogin: string;
}
export interface UserUpdateData {
  name?: string;
  profile?: {
    avatar?: string;
    bio?: string;
    socialLinks?: {
      type: string;
      url: string;
    }[];
  };
  preferences?: Record<string, any>;
}

// Basic user interface for auth state
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar?: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// API Response types
export interface UserProfileResponse extends UserProfile {
  stats?: UserStats;
}

// Service response types
export interface UserProgressResponse {
  completedItems: number;
  totalItems: number;
  progress: number;
  lastActivity?: string;
}

export interface UserSubmissionResponse {
  id: string;
  exerciseId: string;
  status: 'pending' | 'completed' | 'failed';
  score: number;
  submittedAt: string;
}

// Service error types
export interface ServiceError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}