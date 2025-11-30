import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { UserProfile, Group, AcademicRecord } from '../types';

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
    createTeacher: (teacher: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'cuatrimestre'>) => void;
    createStudent: (student: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'assignedCourses'>) => void;
    authorizeStudent: (email: string) => void;
    assignCourseToTeacher: (teacherId: string, courseId: number) => void;
    getGlobalStats: (filter?: { group?: Group; cuatrimestre?: number }) => GlobalStats;

    // Group Management
    groups: string[];
    addGroup: (name: string) => void;
    removeGroup: (name: string) => void;
    updateGroup: (oldName: string, newName: string) => void;
    updateTeacher: (teacher: UserProfile) => void;
    updateStudent: (student: UserProfile) => void;
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
    const { user } = useUser();
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

    const API_URL = import.meta.env.BASE_URL + 'api';

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
        fetchAuthorizedEmails();
        fetchGroups();
        fetchGlobalStats();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch(`${API_URL}/admin.php?action=get_students`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setStudents(data.students);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin.php?action=get_teachers`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setTeachers(data.teachers);
            }
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        }
    };

    const fetchAuthorizedEmails = async () => {
        try {
            const res = await fetch(`${API_URL}/admin.php?action=get_authorized_emails`);
            const data = await res.json();
            if (data.success) {
                setAllowedEmails(data.emails);
            }
        } catch (error) {
            console.error("Failed to fetch authorized emails", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await fetch(`${API_URL}/admin.php?action=get_groups`);
            const data = await res.json();
            if (data.success) {
                setGroups(data.groups);
            }
        } catch (error) {
            console.error("Failed to fetch groups", error);
        }
    };

    const fetchGlobalStats = async () => {
        try {
            const res = await fetch(`${API_URL}/admin.php?action=get_global_stats`);
            const data = await res.json();
            if (data.success) {
                setGlobalStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch global stats", error);
        }
    };

    // Load curriculum based on user profile
    useEffect(() => {
        if (user) {
            // In a real app, we would fetch the user's grades here and update the curriculum status
            // For now, we keep the static structure but this is where we'd merge with API data
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
    const createTeacher = async (teacherData: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'cuatrimestre'>) => {
        // This usually happens via registration, but if we add manual creation:
        console.warn("Manual teacher creation not implemented in backend yet.");
        // We would call an API endpoint here
    };

    const authorizeStudent = async (email: string) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'authorize_email', email })
            });
            const data = await res.json();
            if (data.success) {
                fetchAuthorizedEmails();
            } else {
                alert(data.message || "Error al autorizar email");
            }
        } catch (error) {
            console.error("Error authorizing student", error);
        }
    };

    const createStudent = async (studentData: Omit<UserProfile, 'id' | 'role' | 'achievements' | 'completedLessons' | 'completedQuizzes' | 'xp' | 'level' | 'assignedCourses'>) => {
        console.warn("Manual student creation from admin not yet fully implemented in backend. Use registration flow.");
        fetchStudents();
    };

    const assignCourseToTeacher = async (teacherId: string, courseId: number) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'assign_course',
                    teacher_id: teacherId,
                    course_id: courseId
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchTeachers(); // Refresh to show assignment
            } else {
                alert(data.message || "Error al asignar curso");
            }
        } catch (error) {
            console.error("Error assigning course", error);
        }
    };

    const addGroup = async (name: string) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_group', name })
            });
            const data = await res.json();
            if (data.success) {
                fetchGroups();
            }
        } catch (error) {
            console.error("Error adding group", error);
        }
    };

    const removeGroup = async (name: string) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove_group', name })
            });
            const data = await res.json();
            if (data.success) {
                fetchGroups();
            }
        } catch (error) {
            console.error("Error removing group", error);
        }
    };

    const updateGroup = async (oldName: string, newName: string) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_group',
                    old_name: oldName,
                    new_name: newName
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchGroups();
                fetchStudents(); // Refresh students as their group might have changed
            }
        } catch (error) {
            console.error("Error updating group", error);
        }
    };

    const updateTeacher = async (updatedTeacher: UserProfile) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_teacher',
                    id: updatedTeacher.id,
                    name: updatedTeacher.name,
                    email: updatedTeacher.email,
                    bio: updatedTeacher.bio
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchTeachers();
            }
        } catch (error) {
            console.error("Error updating teacher", error);
        }
    };

    const updateStudent = async (updatedStudent: UserProfile) => {
        try {
            const res = await fetch(`${API_URL}/admin.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_student',
                    id: updatedStudent.id,
                    name: updatedStudent.name,
                    email: updatedStudent.email,
                    cuatrimestre: updatedStudent.cuatrimestre,
                    group_name: updatedStudent.group
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchStudents();
            }
        } catch (error) {
            console.error("Error updating student", error);
        }
    };

    const getGlobalStats = (filter?: { group?: Group; cuatrimestre?: number }): GlobalStats => {
        // In a real app we would pass filters to the API
        // For now returning the fetched global stats
        return globalStats;
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

