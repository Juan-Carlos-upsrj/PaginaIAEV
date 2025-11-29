import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Achievement } from '../types';

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (email: string, name: string, password?: string) => Promise<boolean | void>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<boolean | void>;
    addXp: (amount: number) => void;
    completeLesson: (lessonId: number) => void;
    completeQuiz: (quizId: number, score: number) => void;
    assignCourse: (courseId: number) => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    switchProfile: (profileId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // API URL - relative to base path
    const API_URL = import.meta.env.BASE_URL + 'api';

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const res = await fetch(`${API_URL}/auth.php?action=check_session`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Session check failed", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, name: string, password?: string) => {
        try {
            if (password) {
                const res = await fetch(`${API_URL}/auth.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', email, password })
                });
                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                    return true;
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } else {
                console.warn("Login called without password - legacy mode not supported in backend");
                return false;
            }
        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            const res = await fetch(`${API_URL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'register', ...userData })
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                return true;
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' })
            });
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const addXp = async (amount: number) => {
        if (!user) return;

        const newXp = user.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        const levelUp = newLevel > user.level;

        if (levelUp) {
            alert(`¡Subiste de nivel! Ahora eres Nivel ${newLevel}`);
        }

        const updatedUser = { ...user, xp: newXp, level: newLevel };
        setUser(updatedUser);

        try {
            await fetch(`${API_URL}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_xp', userId: user.id, xp: newXp, level: newLevel })
            });
        } catch (error) {
            console.error("Failed to sync XP", error);
        }
    };

    const completeLesson = async (lessonId: number) => {
        if (!user) return;
        if (user.completedLessons.includes(lessonId)) return;

        const updatedUser = {
            ...user,
            completedLessons: [...user.completedLessons, lessonId]
        };
        setUser(updatedUser);

        addXp(50);

        try {
            await fetch(`${API_URL}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete_lesson', userId: user.id, lessonId })
            });
        } catch (error) {
            console.error("Failed to sync lesson", error);
        }
    };

    const completeQuiz = async (quizId: number, score: number) => {
        if (!user) return;
        if (user.completedQuizzes.includes(quizId)) return;

        const updatedUser = {
            ...user,
            completedQuizzes: [...user.completedQuizzes, quizId]
        };
        setUser(updatedUser);

        const xpEarned = score * 10;
        addXp(xpEarned);

        try {
            await fetch(`${API_URL}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete_quiz', userId: user.id, quizId, score })
            });
        } catch (error) {
            console.error("Failed to sync quiz", error);
        }
    };

    const assignCourse = (courseId: number) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return null;
            if (prev.assignedCourses?.includes(courseId)) return prev;
            return {
                ...prev,
                assignedCourses: [...(prev.assignedCourses || []), courseId]
            };
        });
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;

        // Optimistic update
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...data };
        });

        try {
            await fetch(`${API_URL}/student.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_profile',
                    user_id: user.id,
                    name: data.name || user.name,
                    bio: data.bio || user.bio,
                    avatar: data.avatar || user.avatar,
                    social_links: data.socialLinks || user.socialLinks
                })
            });
        } catch (error) {
            console.error("Failed to update profile", error);
            checkSession(); // Revert on error
        }
    };

    const switchProfile = async (profileId: string) => {
        console.warn("Switch profile not supported in backend mode");
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout, register, addXp, completeLesson, completeQuiz, assignCourse, updateProfile, switchProfile }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
