export interface Course {
  totalLessons: number;
  completedLessons: number;
  progress: string;
  requirements: string[];
  goals: string[];
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  modules: Module[];
  enrolledCount: number;
  rating: number;
  instructor: {
    id: string;
    name: string;
  };
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  description: any;
  progress: string;
  lessonId: string;
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  exercises: string[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  pointsValue: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isVisible: boolean;
}
