import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { UserProfile, Group, AcademicRecord } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Subject {
    id: string;
    name: string;
    credits: number;
    grade?: number;
    status: 'completed' | 'enrolled' | 'pending';
    quarter: number;
}

export interface Quarter {
    id: number;
    name: string;
    subjects: Subject[];
    status: 'completed' | 'current' | 'future';
    average?: number;
}

export interface GlobalStats {
    averageAttendance: number;
    averageGrade: number;
    totalStudents: number;
    activeCourses: number;
}

interface AcademicContextType {
    // Student features
    quarters: Quarter[];
    currentQuarter: Quarter | undefined;
    gpa: number;
    progress: number;

    // Admin features
    teachers: UserProfile[];
    students: UserProfile[];
    createTeacher: (teacher: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'cuatrimestre'>) => void;
    createStudent: (student: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'assignedCourses'>) => void;
    assignCourseToTeacher: (teacherId: string, courseId: number) => void;
    getGlobalStats: (filter?: { group?: Group; cuatrimestre?: number }) => GlobalStats;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

const initialCurriculum: Quarter[] = [
    {
        id: 1,
        name: 'Primer Cuatrimestre',
        status: 'completed',
        average: 9.2,
        subjects: [
            { id: 'MAT101', name: 'Matemáticas para Ingeniería', credits: 8, grade: 9.5, status: 'completed', quarter: 1 },
            { id: 'PRO101', name: 'Fundamentos de Programación', credits: 8, grade: 9.0, status: 'completed', quarter: 1 },
            { id: 'DIS101', name: 'Introducción al Diseño Digital', credits: 6, grade: 9.2, status: 'completed', quarter: 1 },
            { id: 'ING101', name: 'Inglés I', credits: 5, grade: 9.0, status: 'completed', quarter: 1 }
        ]
    },
    {
        id: 2,
        name: 'Segundo Cuatrimestre',
        status: 'current',
        subjects: [
            { id: 'PRO102', name: 'Programación Orientada a Objetos', credits: 8, status: 'enrolled', quarter: 2 },
            { id: '3D101', name: 'Modelado 3D Básico', credits: 8, status: 'enrolled', quarter: 2 },
            { id: 'FIS101', name: 'Física para Animación', credits: 6, status: 'enrolled', quarter: 2 },
            { id: 'ING102', name: 'Inglés II', credits: 5, status: 'enrolled', quarter: 2 }
        ]
    },
    {
        id: 3,
        name: 'Tercer Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'EST101', name: 'Estructura de Datos', credits: 8, status: 'pending', quarter: 3 },
            { id: '3D102', name: 'Rigging y Animación', credits: 8, status: 'pending', quarter: 3 },
            { id: 'WEB101', name: 'Desarrollo Web Frontend', credits: 6, status: 'pending', quarter: 3 },
            { id: 'ING103', name: 'Inglés III', credits: 5, status: 'pending', quarter: 3 }
        ]
    },
    {
        id: 4,
        name: 'Cuarto Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'HOU101', name: 'Introducción a Houdini', credits: 8, status: 'pending', quarter: 4 },
            { id: 'WEB102', name: 'Backend y Bases de Datos', credits: 8, status: 'pending', quarter: 4 },
            { id: 'PROJ101', name: 'Proyecto Integrador I', credits: 10, status: 'pending', quarter: 4 }
        ]
    },
    {
        id: 5,
        name: 'Quinto Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'HOU102', name: 'Houdini Avanzado: VFX', credits: 8, status: 'pending', quarter: 5 },
            { id: 'GAME101', name: 'Motores de Videojuegos (Unreal)', credits: 8, status: 'pending', quarter: 5 },
            { id: 'PROJ102', name: 'Proyecto Integrador II', credits: 10, status: 'pending', quarter: 5 }
        ]
    },
    {
        id: 6,
        name: 'Sexto Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'VR101', name: 'Realidad Virtual y Aumentada', credits: 8, status: 'pending', quarter: 6 },
            { id: 'AI101', name: 'Inteligencia Artificial para Creativos', credits: 8, status: 'pending', quarter: 6 },
            { id: 'MKT101', name: 'Marketing Digital', credits: 6, status: 'pending', quarter: 6 }
        ]
    },
    {
        id: 7,
        name: 'Séptimo Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'ANIM101', name: 'Animación de Personajes Avanzada', credits: 8, status: 'pending', quarter: 7 },
            { id: 'COMP101', name: 'Composición Digital (Nuke)', credits: 8, status: 'pending', quarter: 7 },
            { id: 'PORT101', name: 'Desarrollo de Portafolio', credits: 6, status: 'pending', quarter: 7 }
        ]
    },
    {
        id: 8,
        name: 'Octavo Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'SPEC101', name: 'Especialización Técnica I', credits: 8, status: 'pending', quarter: 8 },
            { id: 'PROJ103', name: 'Pre-producción de Tesis', credits: 10, status: 'pending', quarter: 8 },
            { id: 'ETH101', name: 'Ética Profesional', credits: 4, status: 'pending', quarter: 8 }
        ]
    },
    {
        id: 9,
        name: 'Noveno Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'SPEC102', name: 'Especialización Técnica II', credits: 8, status: 'pending', quarter: 9 },
            { id: 'PROJ104', name: 'Producción de Tesis', credits: 12, status: 'pending', quarter: 9 },
            { id: 'BUS101', name: 'Negocios para Creativos', credits: 6, status: 'pending', quarter: 9 }
        ]
    },
    {
        id: 10,
        name: 'Décimo Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'RES101', name: 'Estadía Profesional', credits: 20, status: 'pending', quarter: 10 },
            { id: 'SEM101', name: 'Seminario de Titulación', credits: 5, status: 'pending', quarter: 10 }
        ]
    }
];

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [quarters, setQuarters] = useState<Quarter[]>(initialCurriculum);
    const [gpa, setGpa] = useState(0);
    const [progress, setProgress] = useState(0);

    // Admin State
    const [teachers, setTeachers] = useLocalStorage<UserProfile[]>('teachers', []);
    const [students, setStudents] = useLocalStorage<UserProfile[]>('students', []);

    // Load curriculum based on user profile
    useEffect(() => {
        if (user) {
            // Dynamic import to avoid circular dependencies if any, though here it's fine
            import('../data/mockProfiles').then(({ MOCK_PROFILES }) => {
                const mockProfile = MOCK_PROFILES.find(p => p.id === user.id);
                if (mockProfile) {
                    setQuarters(mockProfile.curriculum);
                } else {
                    // Reset to default if not a mock profile (or load from real backend in future)
                    setQuarters(initialCurriculum);
                }
            });
        }
    }, [user]);

    useEffect(() => {
        // Calculate GPA
        let totalGrades = 0;
        let totalSubjects = 0;
        let completedSubjects = 0;
        let allSubjectsCount = 0;

        quarters.forEach(q => {
            q.subjects.forEach(s => {
                allSubjectsCount++;
                if (s.status === 'completed' && s.grade) {
                    totalGrades += s.grade;
                    totalSubjects++;
                    completedSubjects++;
                }
            });
        });

        setGpa(totalSubjects > 0 ? Number((totalGrades / totalSubjects).toFixed(1)) : 0);
        setProgress(allSubjectsCount > 0 ? Math.round((completedSubjects / allSubjectsCount) * 100) : 0);
    }, [quarters]);

    // Admin Functions
    const createTeacher = (teacherData: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'cuatrimestre'>) => {
        const newTeacher: UserProfile = {
            ...teacherData,
            id: `teacher-${Date.now()}`,
            role: 'teacher',
            achievements: [],
            completedLessons: [],
            completedQuizzes: [],
            xp: 0,
            level: 1,
            cuatrimestre: 0, // Teachers don't have a cuatrimestre
            assignedCourses: []
        };
        setTeachers([...teachers, newTeacher]);
    };

    const createStudent = (studentData: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'assignedCourses'>) => {
        const newStudent: UserProfile = {
            ...studentData,
            id: `student-${Date.now()}`,
            role: 'student',
            achievements: [],
            completedLessons: [],
            completedQuizzes: [],
            xp: 0,
            level: 1,
            // cuatrimestre and group are passed in studentData
        };
        setStudents([...students, newStudent]);
    };

    const assignCourseToTeacher = (teacherId: string, courseId: number) => {
        setTeachers(teachers.map(t => {
            if (t.id === teacherId) {
                const currentCourses = t.assignedCourses || [];
                if (!currentCourses.includes(courseId)) {
                    return { ...t, assignedCourses: [...currentCourses, courseId] };
                }
            }
            return t;
        }));
    };

    const getGlobalStats = (filter?: { group?: Group; cuatrimestre?: number }): GlobalStats => {
        // Mock calculation - in a real app this would aggregate from all students
        // For demo purposes, we return static or semi-random data based on filters

        let baseAttendance = 85;
        let baseGrade = 8.5;

        if (filter?.cuatrimestre) {
            baseAttendance += (filter.cuatrimestre % 2 === 0) ? 5 : -2;
            baseGrade += (filter.cuatrimestre === 1) ? 0.5 : -0.2;
        }

        if (filter?.group) {
            if (filter.group === 'A') baseGrade += 0.3;
            if (filter.group === 'B') baseAttendance -= 5;
        }

        return {
            averageAttendance: Math.min(100, Math.max(0, baseAttendance)),
            averageGrade: Math.min(10, Math.max(0, baseGrade)),
            totalStudents: 120, // Mock total
            activeCourses: 15
        };
    };

    const currentQuarter = quarters.find(q => q.status === 'current');

    return (
        <AcademicContext.Provider value={{
            quarters,
            currentQuarter,
            gpa,
            progress,
            teachers,
            students,
            createTeacher,
            createStudent,
            assignCourseToTeacher,
            getGlobalStats
        }}>
            {children}
        </AcademicContext.Provider>
    );
};

export const useAcademic = () => {
    const context = useContext(AcademicContext);
    if (context === undefined) {
        throw new Error('useAcademic must be used within an AcademicProvider');
    }
    return context;
};
