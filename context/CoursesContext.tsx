import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';
import type { Course, CourseSummary } from '../types';

interface CoursesContextType {
  courses: Course[];
  summaries: CourseSummary[];
  loading: boolean;
  error: string | null;
  getCourse: (id: number) => Course | undefined;
  refreshCourses: () => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getCourses();

      if (response.success && Array.isArray(response.courses)) {
        setCourses(transformCoursesData(response.courses));
      } else {
        throw new Error('Invalid courses data');
      }
    } catch (err: any) {
      console.error('Error loading courses:', err);
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const transformCoursesData = (rawCourses: any[]): Course[] => {
    return rawCourses.map(course => ({
      id: parseInt(course.id),
      title: course.title || '',
      subtitle: course.subtitle || '',
      description: course.description || '',
      thumbnail: course.thumbnail || 'https://via.placeholder.com/400x300',
      cuatrimestre: parseInt(course.cuatrimestre) || 1,
      modules: Array.isArray(course.modules) ? course.modules.map((mod: any) => ({
        id: parseInt(mod.id),
        title: mod.title || '',
        lessons: Array.isArray(mod.lessons) ? mod.lessons.map((lesson: any) => ({
          id: parseInt(lesson.id),
          title: lesson.title || '',
          videoId: lesson.video_url || lesson.videoId || '',
          duration: lesson.duration || '0:00',
          description: lesson.content || lesson.description || '',
        })) : []
      })) : []
    }));
  };

  const summaries = useMemo((): CourseSummary[] => {
    if (!user) return [];

    return courses.map(course => {
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = course.modules
        .flatMap(m => m.lessons)
        .filter(l => user.completedLessons.includes(l.id))
        .length;

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      let status: CourseSummary['status'] = 'new';
      if (progress === 100) status = 'completed';
      else if (progress > 0) status = 'active';

      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        progress,
        status,
        thumbnail: course.thumbnail,
      };
    });
  }, [courses, user]);

  const getCourse = (id: number) => courses.find(c => c.id === id);

  return (
    <CoursesContext.Provider value={{ courses, summaries, loading, error, getCourse, refreshCourses: loadCourses }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within CoursesProvider');
  }
  return context;
};
