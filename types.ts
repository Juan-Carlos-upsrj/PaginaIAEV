export interface Lesson {
  id: number;
  title: string;
  videoId: string;
  duration: string;
  description: string;
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
  modules: Module[];
}

export interface CourseSummary {
    id: number;
    title: string;
    subtitle: string;
    progress: number; // 0-100
    status: 'active' | 'completed' | 'new';
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
}
