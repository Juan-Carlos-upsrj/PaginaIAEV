import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { CourseProvider } from './context/CourseContext';
import { AcademicProvider } from './context/AcademicContext';
import { BookmarkProvider } from './context/BookmarkContext';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseIntroPage from './pages/CourseIntroPage';
import CoursePage from './pages/CoursePage';
import CommunityPage from './pages/CommunityPage';
import BookmarksPage from './pages/BookmarksPage';
import CalendarPage from './pages/CalendarPage';
import KardexPage from './pages/KardexPage';
import CertificatePage from './pages/CertificatePage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseEditor from './pages/admin/CourseEditor';
import StudentsPage from './pages/admin/StudentsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

// Layouts
import AdminLayout from './layouts/AdminLayout';

const AppRoutes: React.FC = () => {
  const { user } = useUser();

  const isAuthenticated = !!user;
  const isTeacher = user?.role === 'teacher';

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isTeacher ? "/admin" : "/dashboard"} />} />

      {/* Student Routes */}
      <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="/courses" element={isAuthenticated ? <CoursesPage /> : <Navigate to="/login" />} />

      {/* Course Flow */}
      <Route path="/course/:courseId" element={isAuthenticated ? <CourseIntroPage /> : <Navigate to="/login" />} />
      <Route path="/course/:courseId/learn" element={isAuthenticated ? <CoursePage /> : <Navigate to="/login" />} />

      <Route path="/community" element={isAuthenticated ? <CommunityPage /> : <Navigate to="/login" />} />
      <Route path="/bookmarks" element={isAuthenticated ? <BookmarksPage /> : <Navigate to="/login" />} />
      <Route path="/calendar" element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />} />
      <Route path="/kardex" element={isAuthenticated ? <KardexPage /> : <Navigate to="/login" />} />
      <Route path="/certificate/:courseId" element={isAuthenticated ? <CertificatePage /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route path="/admin" element={isAuthenticated && isTeacher ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="course/new" element={<CourseEditor />} />
        <Route path="course/:courseId" element={<CourseEditor />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? (isTeacher ? "/admin" : "/dashboard") : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <CourseProvider>
        <AcademicProvider>
          <BookmarkProvider>
            <Router basename="/PaginaIAEV">
              <AppRoutes />
            </Router>
          </BookmarkProvider>
        </AcademicProvider>
      </CourseProvider>
    </UserProvider>
  );
};

export default App;