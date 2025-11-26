import React, { createContext, useContext } from 'react';
import type { UserProfile, Achievement } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserContextType {
    user: UserProfile | null;
    login: (email: string, name: string) => void;
    logout: () => void;
    addXp: (amount: number) => void;
    completeLesson: (lessonId: number) => void;
    completeQuiz: (quizId: number, score: number) => void;
    assignCourse: (courseId: number) => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    switchProfile: (profileId: string) => void;
}

const AVAILABLE_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_lesson', title: 'Primeros Pasos', description: 'Completa tu primera lección', icon: 'footsteps-outline' },
    { id: 'quiz_master', title: 'Cerebrito', description: 'Obtén 100% en un quiz', icon: 'bulb-outline' },
    { id: 'level_5', title: 'Dedicado', description: 'Alcanza el nivel 5', icon: 'star-outline' }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser, removeUser] = useLocalStorage<UserProfile | null>('iaev_user', null);

    const login = (email: string, name: string) => {
        // Determine role based on env var allowlist
        const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
        // Fallback for dev/demo if env not set, though ideally should be in .env
        const defaultAdmins = ['admin@iaev.mx', 'profesor@iaev.mx'];
        const allAdmins = [...adminEmails, ...defaultAdmins];

        const isTeacher = allAdmins.some(admin => admin.trim().toLowerCase() === email.toLowerCase());
        const role = isTeacher ? 'teacher' : 'student';

        // Generate a simple ID based on email
        const id = email.toLowerCase().replace(/[^a-z0-9]/g, '');

        const newUser: UserProfile = {
            id,
            name,
            email,
            role,
            xp: 0,
            level: 1,
            cuatrimestre: 1, // Default to 1st cuatrimestre
            achievements: [],
            completedLessons: [],
            completedQuizzes: [],
            assignedCourses: []
        };
        setUser(newUser);
    };

    const logout = () => {
        removeUser();
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

    const updateProfile = (data: Partial<UserProfile>) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...data };
        });
    };

    const switchProfile = async (profileId: string) => {
        // Dynamic import to avoid circular dependencies
        const { MOCK_PROFILES } = await import('../data/mockProfiles');
        const mockProfile = MOCK_PROFILES.find(p => p.id === profileId);

        if (mockProfile) {
            setUser(mockProfile.user);
            // Force reload to ensure all contexts update (simple way to reset state)
            // In a real app we might want to reset contexts more gracefully
            window.location.reload();
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, addXp, completeLesson, completeQuiz, assignCourse, updateProfile, switchProfile }}>
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
