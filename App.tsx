import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import AdminLayout from './layouts/AdminLayout';

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

      <Route
        path="/course/:courseId/learn"
        element={
          <ProtectedRoute requireRole="student">
            <CoursePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireRole="teacher">
            <AdminLayout />
          </ProtectedRoute>
        }
      />

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
          <AppRoutes />
        </CoursesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
