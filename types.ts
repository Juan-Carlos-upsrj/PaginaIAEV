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

export interface CourseIntro {
  teacherInfo: {
    name: string;
    bio: string;
    image: string;
  };
  studentWork: {
    title: string;
    image: string;
  }[];
  software: {
    name: string;
    icon: string;
  }[];
  hardware: {
    cpu: string;
    ram: string;
    gpu: string;
  };
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnail?: string;
  instructor?: string;
  instructorId?: string; // Link to UserProfile.id
  cuatrimestre?: number;
  intro?: CourseIntro;
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
  description?: string;
  icon?: string;
  unlockedAt?: string;
}

export type Group = string;

export interface Grade {
  courseId: number;
  score: number; // 0-100
  lastUpdated: string;
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
}

export interface AcademicRecord {
  grades: Grade[];
  attendance: AttendanceRecord[];
  averageGrade: number;
  attendanceRate: number; // 0-100
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  xp: number;
  level: number;
  cuatrimestre: number;
  group?: Group; // Added group
  academicRecord?: AcademicRecord; // Added academic record
  achievements: Achievement[];
  completedLessons: number[];
  completedQuizzes: number[];
  assignedCourses?: number[]; // IDs of courses assigned to this teacher
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}
