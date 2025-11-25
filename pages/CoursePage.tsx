import React, { useState, useCallback, useMemo } from 'react';
import type { Module, Lesson, Notification, Course } from '../types';
import Sidebar from '../components/Sidebar';
import VideoPlayer from '../components/VideoPlayer';
import LessonContent from '../components/LessonContent';
import NotificationBell from '../components/NotificationBell';

const initialNotifications: Notification[] = [
    { id: 1, message: '¡Has completado el curso de Diseño Web!', read: false },
    { id: 2, message: 'Nueva lección disponible en el Módulo 2', read: false },
    { id: 4, message: '¡Bienvenido a la plataforma!', read: false },
];

interface CoursePageProps {
    course: Course;
    onExitCourse: () => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ course, onExitCourse }) => {
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<number>(course.modules[0].lessons[0].id);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const allLessons: Lesson[] = useMemo(() => course.modules.flatMap(module => module.lessons), [course]);
  const activeLesson = useMemo(() => allLessons.find(lesson => lesson.id === activeLessonId), [allLessons, activeLessonId]);

  const handleLessonComplete = useCallback(() => {
    if (!activeLesson) return;

    setCompletedLessons(prev => new Set(prev).add(activeLesson.id));

    const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === activeLesson.id);
    const nextLesson = allLessons[currentLessonIndex + 1];

    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
      setNotifications(prev => [
        { id: Date.now(), message: `Nueva lección desbloqueada: ${nextLesson.title}`, read: false },
        ...prev
      ]);
    } else {
        setNotifications(prev => [
        { id: Date.now(), message: `¡Felicidades! Has completado ${course.title}.`, read: false },
        ...prev
      ]);
    }
  }, [activeLesson, allLessons, course.title]);
  
  const handleSelectLesson = useCallback((lessonId: number) => {
     setActiveLessonId(lessonId);
  }, []);
  
  const handleMarkNotificationAsRead = useCallback((notificationId: number) => {
    setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  if (!activeLesson) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          courseTitle={course.title}
          modules={course.modules}
          activeLessonId={activeLessonId}
          completedLessons={completedLessons}
          onSelectLesson={handleSelectLesson}
        />
        <main className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500">Cargando lección...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar 
        courseTitle={course.title}
        modules={course.modules}
        activeLessonId={activeLessonId}
        completedLessons={completedLessons}
        onSelectLesson={handleSelectLesson}
      />
      <main className="w-full md:w-3/4 lg:w-4/5 h-full overflow-y-auto">
         <header className="flex justify-between items-center p-4 sticky top-0 z-20 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100">
             <button
                onClick={onExitCourse}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-semibold transition-colors p-2 rounded-md hover:bg-gray-200/50"
             >
                <ion-icon name="arrow-back-outline"></ion-icon>
                Volver al Dashboard
            </button>
            <NotificationBell 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
         </header>
         <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="bg-black rounded-lg shadow-2xl mb-6 relative overflow-hidden aspect-video">
               <VideoPlayer 
                 key={activeLesson.id} 
                 videoId={activeLesson.videoId}
                 onLessonComplete={handleLessonComplete}
               />
            </div>
            <LessonContent lesson={activeLesson} />
         </div>
      </main>
    </div>
  );
};

export default CoursePage;