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
