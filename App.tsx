import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { CourseProvider } from './context/CourseContext';
import { AcademicProvider } from './context/AcademicContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { generateCSRFToken } from './utils/csrf';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Loaded Pages
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage'));
const CourseIntroPage = React.lazy(() => import('./pages/CourseIntroPage'));
const CoursePage = React.lazy(() => import('./pages/CoursePage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const BookmarksPage = React.lazy(() => import('./pages/BookmarksPage'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const KardexPage = React.lazy(() => import('./pages/KardexPage'));
const CertificatePage = React.lazy(() => import('./pages/CertificatePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Lazy Loaded Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const CourseEditor = React.lazy(() => import('./pages/admin/CourseEditor'));
const StudentsPage = React.lazy(() => import('./pages/admin/StudentsPage'));
const AnalyticsPage = React.lazy(() => import('./pages/admin/AnalyticsPage'));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { user } = useUser();

  const isAuthenticated = !!user;
  const isTeacher = user?.role === 'teacher';

  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isTeacher ? "/admin" : "/dashboard"} />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />

        {/* Course Flow */}
        <Route path="/course/:courseId" element={<ProtectedRoute requireCourse><CourseIntroPage /></ProtectedRoute>} />
        <Route path="/course/:courseId/learn" element={<ProtectedRoute requireCourse><CoursePage /></ProtectedRoute>} />

        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/kardex" element={<ProtectedRoute><KardexPage /></ProtectedRoute>} />
        <Route path="/certificate/:courseId" element={<ProtectedRoute requireCourse><CertificatePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={isAuthenticated && isTeacher ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="course/new" element={<CourseEditor />} />
          <Route path="course/:courseId" element={<CourseEditor />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? (isTeacher ? "/admin" : "/dashboard") : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    generateCSRFToken();

  }, []);

  return (
    <UserProvider>
      <CourseProvider>
        <AcademicProvider>
          <BookmarkProvider>
            <Router basename="/iaev">
              <AppRoutes />
            </Router>
          </BookmarkProvider>
        </AcademicProvider>
      </CourseProvider>
    </UserProvider>
  );
};

export default App;