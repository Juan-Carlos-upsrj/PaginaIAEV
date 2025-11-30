import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import { AcademicProvider } from './context/AcademicContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import AdminLayout from './layouts/AdminLayout';

// Student Pages (Restored)
import CoursesPage from './pages/CoursesPage';
import CourseIntroPage from './pages/CourseIntroPage';
import CommunityPage from './pages/CommunityPage';
import BookmarksPage from './pages/BookmarksPage';
import CalendarPage from './pages/CalendarPage';
import KardexPage from './pages/KardexPage';
import CertificatePage from './pages/CertificatePage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages (Restored)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import CourseEditor from './pages/admin/CourseEditor';
import AnalyticsPage from './pages/admin/AnalyticsPage';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const isAuthenticated = !!user;
  const isTeacher = user?.role === 'teacher';

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireRole="student">
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/courses" element={<ProtectedRoute requireRole="student"><CoursesPage /></ProtectedRoute>} />

      {/* Course Flow */}
      <Route path="/course/:courseId" element={<ProtectedRoute requireRole="student"><CourseIntroPage /></ProtectedRoute>} />
      <Route path="/course/:courseId/learn" element={<ProtectedRoute requireRole="student"><CoursePage /></ProtectedRoute>} />

      <Route path="/community" element={<ProtectedRoute requireRole="student"><CommunityPage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute requireRole="student"><BookmarksPage /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute requireRole="student"><CalendarPage /></ProtectedRoute>} />
      <Route path="/kardex" element={<ProtectedRoute requireRole="student"><KardexPage /></ProtectedRoute>} />
      <Route path="/certificate/:courseId" element={<ProtectedRoute requireRole="student"><CertificatePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute requireRole="student"><ProfilePage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="teacher">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="teachers" element={<AdminUsersPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="course/new" element={<CourseEditor />} />
        <Route path="course/:courseId" element={<CourseEditor />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? (isTeacher ? "/admin" : "/dashboard") : "/login"} replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router basename="/iaev">
      <AuthProvider>
        <CoursesProvider>
          <AcademicProvider>
            <BookmarkProvider>
              <AppRoutes />
            </BookmarkProvider>
          </AcademicProvider>
        </CoursesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
