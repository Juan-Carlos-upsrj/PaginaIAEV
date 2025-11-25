import React, { useState, useMemo } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import { courseData } from './data/courses';
import type { Course } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedCourseId(null);
  };
  const handleSelectCourse = (courseId: number) => setSelectedCourseId(courseId);
  const handleExitCourse = () => setSelectedCourseId(null);

  const selectedCourse = useMemo(() => {
    return courseData.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="text-gray-800 font-sans">
      {selectedCourse ? (
        <CoursePage 
            key={selectedCourse.id}
            course={selectedCourse} 
            onExitCourse={handleExitCourse} 
        />
      ) : (
        <DashboardPage 
            onSelectCourse={handleSelectCourse} 
            onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;