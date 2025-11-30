import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProgress: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await api.checkSession();

      if (response.success && response.user) {
        setUser(transformUserData(response.user));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.login(email, password);

      if (response.success && response.user) {
        setUser(transformUserData(response.user));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.register(userData);

      if (response.success && response.user) {
        setUser(transformUserData(response.user));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Forzar logout en el frontend aunque falle el backend
      setUser(null);
    }
  };

  const updateUserProgress = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Transformar datos del backend al formato del frontend
  const transformUserData = (rawUser: any): UserProfile => {
    return {
      id: rawUser.id?.toString() || '',
      name: rawUser.name || '',
      email: rawUser.email || '',
      role: rawUser.role || 'student',
      xp: parseInt(rawUser.xp) || 0,
      level: parseInt(rawUser.level) || 1,
      cuatrimestre: parseInt(rawUser.cuatrimestre) || 1,
      group: rawUser.group_name || rawUser.group,
      achievements: Array.isArray(rawUser.achievements) ? rawUser.achievements : [],
      completedLessons: Array.isArray(rawUser.completedLessons)
        ? rawUser.completedLessons.map((id: any) => parseInt(id))
        : [],
      completedQuizzes: Array.isArray(rawUser.completedQuizzes) ? rawUser.completedQuizzes.map((id: any) => parseInt(id)) : [],
      assignedCourses: Array.isArray(rawUser.assignedCourses) ? rawUser.assignedCourses.map((id: any) => parseInt(id)) : [],
      bio: rawUser.bio || '',
      avatar: rawUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || 'User')}`,
      socialLinks: typeof rawUser.social_links === 'string'
        ? JSON.parse(rawUser.social_links)
        : (rawUser.socialLinks || {}),
    };
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUserProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
