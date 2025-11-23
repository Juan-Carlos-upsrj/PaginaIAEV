import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Achievement } from '../types';

interface UserContextType {
    user: UserProfile | null;
    login: (email: string, name: string) => void;
    logout: () => void;
    addXp: (amount: number) => void;
    completeLesson: (lessonId: number) => void;
    completeQuiz: (quizId: number, score: number) => void;
}

const AVAILABLE_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_lesson', title: 'Primeros Pasos', description: 'Completa tu primera lección', icon: 'footsteps-outline' },
    { id: 'quiz_master', title: 'Cerebrito', description: 'Obtén 100% en un quiz', icon: 'bulb-outline' },
    { id: 'level_5', title: 'Dedicado', description: 'Alcanza el nivel 5', icon: 'star-outline' }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem('iaev_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('iaev_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('iaev_user');
        }
    }, [user]);

    const login = (email: string, name: string) => {
        // Determine role based on email
        // Student: starts with numbers (e.g., 0000120120@...)
        // Teacher: starts with letters (e.g., jsalgado@...)
        const isStudent = /^\d/.test(email);
        const role = isStudent ? 'student' : 'teacher';

        const newUser: UserProfile = {
            name,
            email,
            role,
            xp: 0,
            level: 1,
            achievements: [],
            completedLessons: [],
            completedQuizzes: []
        };
        setUser(newUser);
    };

    const logout = () => {
        setUser(null);
    };

    const checkAchievements = (currentUser: UserProfile) => {
        const newAchievements = [...currentUser.achievements];
        let updated = false;

        // Check First Lesson
        if (currentUser.completedLessons.length > 0 && !newAchievements.find(a => a.id === 'first_lesson')) {
            const achievement = AVAILABLE_ACHIEVEMENTS.find(a => a.id === 'first_lesson');
            if (achievement) {
                newAchievements.push({ ...achievement, unlockedAt: new Date().toISOString() });
                updated = true;
                alert(`¡Logro Desbloqueado! ${achievement.title}`);
            }
        }

        // Check Level 5
        if (currentUser.level >= 5 && !newAchievements.find(a => a.id === 'level_5')) {
            const achievement = AVAILABLE_ACHIEVEMENTS.find(a => a.id === 'level_5');
            if (achievement) {
                newAchievements.push({ ...achievement, unlockedAt: new Date().toISOString() });
                updated = true;
                alert(`¡Logro Desbloqueado! ${achievement.title}`);
            }
        }

        return updated ? newAchievements : null;
    };

    const addXp = (amount: number) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return null;
            const newXp = prev.xp + amount;
            const newLevel = Math.floor(newXp / 100) + 1;
            const levelUp = newLevel > prev.level;

            if (levelUp) {
                alert(`¡Subiste de nivel! Ahora eres Nivel ${newLevel}`);
            }

            const updatedUser = { ...prev, xp: newXp, level: newLevel };
            const newAchievements = checkAchievements(updatedUser);

            return newAchievements ? { ...updatedUser, achievements: newAchievements } : updatedUser;
        });
    };

    const completeLesson = (lessonId: number) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return null;
            if (prev.completedLessons.includes(lessonId)) return prev;

            const updatedUser = {
                ...prev,
                completedLessons: [...prev.completedLessons, lessonId]
            };

            // Add XP for lesson completion
            setTimeout(() => addXp(50), 0);

            const newAchievements = checkAchievements(updatedUser);
            return newAchievements ? { ...updatedUser, achievements: newAchievements } : updatedUser;
        });
    };

    const completeQuiz = (quizId: number, score: number) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return null;
            if (prev.completedQuizzes.includes(quizId)) return prev;

            const updatedUser = {
                ...prev,
                completedQuizzes: [...prev.completedQuizzes, quizId]
            };

            // Add XP based on score
            const xpEarned = score * 10;
            setTimeout(() => addXp(xpEarned), 0);

            return updatedUser;
        });
    };

    return (
        <UserContext.Provider value={{ user, login, logout, addXp, completeLesson, completeQuiz }}>
            {children}
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
