export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface Lesson {
  id: number;
  title: string;
  videoId: string;
  duration: string;
  description: string;
  quiz?: Quiz;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnail?: string;
  instructor?: string;
  modules: Module[];
}

export interface CourseSummary {
  id: number;
  title: string;
  subtitle: string;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'new';
  thumbnail?: string;
}

export interface Achievement {
  id: string;
  title: string;
}
