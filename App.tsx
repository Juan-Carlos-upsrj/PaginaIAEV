import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { CourseProvider } from './context/CourseContext';
import { AcademicProvider } from './context/AcademicContext';
import { BookmarkProvider } from './context/BookmarkContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import CommunityPage from './pages/CommunityPage';
import CoursesPage from './pages/CoursesPage';
import CalendarPage from './pages/CalendarPage';
import KardexPage from './pages/KardexPage';
import BookmarksPage from './pages/BookmarksPage';
import CertificatePage from './pages/CertificatePage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseEditor from './pages/admin/CourseEditor';
import StudentsPage from './pages/admin/StudentsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

const AppRoutes: React.FC = () => {
  const { user } = useUser();
  const isAuthenticated = !!user;
  const isTeacher = user?.role === 'teacher';

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? <LoginPage /> : <Navigate to={isTeacher ? "/admin" : "/dashboard"} />
      } />

      <Route path="/dashboard" element={
        isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
      } />

      <Route path="/community" element={
        isAuthenticated ? <CommunityPage /> : <Navigate to="/login" />
      } />

      <Route path="/courses" element={
        isAuthenticated ? <CoursesPage /> : <Navigate to="/login" />
      } />

      <Route path="/calendar" element={
        isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />
      } />

      <Route path="/kardex" element={
        isAuthenticated ? <KardexPage /> : <Navigate to="/login" />
      } />

      <Route path="/bookmarks" element={
        isAuthenticated ? <BookmarksPage /> : <Navigate to="/login" />
      } />

      <Route path="/course/:courseId" element={
        isAuthenticated ? <CoursePage /> : <Navigate to="/login" />
      } />

      <Route path="/certificate/:courseId" element={
        isAuthenticated ? <CertificatePage /> : <Navigate to="/login" />
      } />

      {/* Admin Routes - Protected by Role */}
      <Route path="/admin" element={
        isAuthenticated && isTeacher ? <AdminLayout /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="course/new" element={<CourseEditor />} />
        <Route path="course/:courseId" element={<CourseEditor />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? (isTeacher ? "/admin" : "/dashboard") : "/login"} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <CourseProvider>
        <AcademicProvider>
          <BookmarkProvider>
            <Router>
              <AppRoutes />
            </Router>
          </BookmarkProvider>
        </AcademicProvider>
      </CourseProvider>
    </UserProvider>
  );
};

export default App;