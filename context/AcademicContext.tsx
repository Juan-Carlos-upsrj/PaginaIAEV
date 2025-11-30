import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile, Group, AcademicRecord } from '../types';
import { api } from '../utils/api';

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
    allowedEmails: string[];
    createTeacher: (teacher: any) => Promise<void>; // Using any to allow password
    createStudent: (student: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'assignedCourses'>) => Promise<void>;
    authorizeStudent: (email: string) => Promise<void>;
    bulkAuthorizeStudents: (emails: string[]) => Promise<void>;
    activateStudent: (studentId: string, status: 'active' | 'inactive') => Promise<void>;
    assignCourseToTeacher: (teacherId: string, courseId: number) => Promise<void>;
    getGlobalStats: (filter?: { group?: Group; cuatrimestre?: number }) => GlobalStats;

    // Group Management
    groups: string[];
    addGroup: (name: string) => Promise<void>;
    removeGroup: (name: string) => Promise<void>;
    updateGroup: (oldName: string, newName: string) => Promise<void>;
    updateTeacher: (teacher: UserProfile) => Promise<void>;
    updateStudent: (student: UserProfile) => Promise<void>;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

// Default curriculum structure (still hardcoded structure, but grades/status will be dynamic in future)
const initialCurriculum: Quarter[] = [
    {
        id: 1,
        name: 'Primer Cuatrimestre',
        status: 'current',
        subjects: [
            { id: 'MAT101', name: 'Matemáticas para Ingeniería', credits: 8, status: 'enrolled', quarter: 1 },
            { id: 'PRO101', name: 'Fundamentos de Programación', credits: 8, status: 'enrolled', quarter: 1 },
            { id: 'DIS101', name: 'Introducción al Diseño Digital', credits: 6, status: 'enrolled', quarter: 1 },
            { id: 'ING101', name: 'Inglés I', credits: 5, status: 'enrolled', quarter: 1 }
        ]
    },
    {
        id: 2,
        name: 'Segundo Cuatrimestre',
        status: 'future',
        subjects: [
            { id: 'PRO102', name: 'Programación Orientada a Objetos', credits: 8, status: 'pending', quarter: 2 },
            { id: '3D101', name: 'Modelado 3D Básico', credits: 8, status: 'pending', quarter: 2 },
            { id: 'FIS101', name: 'Física para Animación', credits: 6, status: 'pending', quarter: 2 },
            { id: 'ING102', name: 'Inglés II', credits: 5, status: 'pending', quarter: 2 }
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
    const { user } = useAuth();
    const [quarters, setQuarters] = useState<Quarter[]>(initialCurriculum);
    const [gpa, setGpa] = useState(0);
    const [progress, setProgress] = useState(0);

    // Admin State
    const [teachers, setTeachers] = useState<UserProfile[]>([]);
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [globalStats, setGlobalStats] = useState<GlobalStats>({
        averageAttendance: 0,
        averageGrade: 0,
        totalStudents: 0,
        activeCourses: 0
    });

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
        fetchAuthorizedEmails();
        fetchGroups();
        fetchGlobalStats();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await api.getStudents();
            setStudents(data.students);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const data = await api.getTeachers();
            setTeachers(data.teachers);
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        }
    };

    const fetchAuthorizedEmails = async () => {
        try {
            const data = await api.getAuthorizedEmails();
            setAllowedEmails(data.emails);
        } catch (error) {
            console.error("Failed to fetch authorized emails", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const data = await api.getGroups();
            setGroups(data.groups);
        } catch (error) {
            console.error("Failed to fetch groups", error);
        }
    };

    const fetchGlobalStats = async () => {
        try {
            const data = await api.getGlobalStats();
            setGlobalStats(data.stats);
        } catch (error) {
            console.error("Failed to fetch global stats", error);
        }
    };

    // Load curriculum based on user profile
    useEffect(() => {
        if (user) {
            setQuarters(initialCurriculum);
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
    const createTeacher = async (teacherData: any) => {
        try {
            await api.createTeacher(teacherData);
            fetchTeachers();
        } catch (error) {
            console.error("Error creating teacher", error);
            throw error;
        }
    };

    const authorizeStudent = async (email: string) => {
        try {
            await api.authorizeEmail(email);
            fetchAuthorizedEmails();
        } catch (error) {
            console.error("Error authorizing student", error);
            throw error;
        }
    };

    const bulkAuthorizeStudents = async (emails: string[]) => {
        try {
            await api.bulkAuthorizeEmails(emails);
            fetchAuthorizedEmails();
        } catch (error) {
            console.error("Error bulk authorizing students", error);
            throw error;
        }
    };

    const createStudent = async (studentData: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'assignedCourses'>) => {
        console.warn("Manual student creation from admin not yet fully implemented in backend. Use registration flow.");
        fetchStudents();
    };

    const activateStudent = async (studentId: string, status: 'active' | 'inactive') => {
        try {
            await api.updateStudentStatus(studentId, status);
            fetchStudents(); // Refresh list to show new status
            fetchGlobalStats(); // Refresh stats from backend, but getGlobalStats overrides count
        } catch (error) {
            console.error("Error activating student", error);
            throw error;
        }
    };

    const assignCourseToTeacher = async (teacherId: string, courseId: number) => {
        try {
            await api.assignCourseToTeacher(teacherId, courseId);
            fetchTeachers(); // Refresh to show assignment
        } catch (error) {
            console.error("Error assigning course", error);
            throw error;
        }
    };

    const addGroup = async (name: string) => {
        try {
            await api.addGroup(name);
            fetchGroups();
        } catch (error) {
            console.error("Error adding group", error);
            throw error;
        }
    };

    const removeGroup = async (name: string) => {
        try {
            await api.removeGroup(name);
            fetchGroups();
        } catch (error) {
            console.error("Error removing group", error);
            throw error;
        }
    };

    const updateGroup = async (oldName: string, newName: string) => {
        try {
            await api.updateGroup(oldName, newName);
            fetchGroups();
            fetchStudents(); // Refresh students as their group might have changed
        } catch (error) {
            console.error("Error updating group", error);
            throw error;
        }
    };

    const updateTeacher = async (updatedTeacher: UserProfile) => {
        try {
            await api.updateTeacher({
                id: updatedTeacher.id,
                name: updatedTeacher.name,
                email: updatedTeacher.email,
                bio: updatedTeacher.bio
            });
            fetchTeachers();
        } catch (error) {
            console.error("Error updating teacher", error);
            throw error;
        }
    };

    const updateStudent = async (updatedStudent: UserProfile) => {
        try {
            await api.updateStudent({
                id: updatedStudent.id,
                name: updatedStudent.name,
                email: updatedStudent.email,
                cuatrimestre: updatedStudent.cuatrimestre,
                group_name: updatedStudent.group
            });
            fetchStudents();
        } catch (error) {
            console.error("Error updating student", error);
            throw error;
        }
    };

    const getGlobalStats = (filter?: { group?: Group; cuatrimestre?: number }): GlobalStats => {
        const activeStudents = students.filter(s => s.status === 'active');
        return {
            ...globalStats,
            totalStudents: activeStudents.length
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
            allowedEmails,
            createTeacher,
            createStudent,
            authorizeStudent,
            bulkAuthorizeStudents,
            activateStudent,
            assignCourseToTeacher,
            getGlobalStats,
            groups,
            addGroup,
            removeGroup,
            updateGroup,
            updateTeacher,
            updateStudent
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
