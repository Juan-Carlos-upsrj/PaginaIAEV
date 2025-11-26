import { Quarter } from '../context/AcademicContext';
import { UserProfile } from '../types';

export interface MockProfile {
    id: string;
    name: string;
    description: string;
    user: UserProfile;
    curriculum: Quarter[];
}

const baseSubjects = [
    // 1st Quarter
    { id: 'MAT101', name: 'Matemáticas para Ingeniería', credits: 8, quarter: 1 },
    { id: 'PRO101', name: 'Fundamentos de Programación', credits: 8, quarter: 1 },
    { id: 'DIS101', name: 'Introducción al Diseño Digital', credits: 6, quarter: 1 },
    { id: 'ING101', name: 'Inglés I', credits: 5, quarter: 1 },
    // 2nd Quarter
    { id: 'PRO102', name: 'Programación Orientada a Objetos', credits: 8, quarter: 2 },
    { id: '3D101', name: 'Modelado 3D Básico', credits: 8, quarter: 2 },
    { id: 'FIS101', name: 'Física para Animación', credits: 6, quarter: 2 },
    { id: 'ING102', name: 'Inglés II', credits: 5, quarter: 2 },
    // 3rd Quarter
    { id: 'EST101', name: 'Estructura de Datos', credits: 8, quarter: 3 },
    { id: '3D102', name: 'Rigging y Animación', credits: 8, quarter: 3 },
    { id: 'WEB101', name: 'Desarrollo Web Frontend', credits: 6, quarter: 3 },
    { id: 'ING103', name: 'Inglés III', credits: 5, quarter: 3 },
    // 4th Quarter
    { id: 'HOU101', name: 'Introducción a Houdini', credits: 8, quarter: 4 },
    { id: 'WEB102', name: 'Backend y Bases de Datos', credits: 8, quarter: 4 },
    { id: 'PROJ101', name: 'Proyecto Integrador I', credits: 10, quarter: 4 }
];

export const MOCK_PROFILES: MockProfile[] = [
    {
        id: 'new_student',
        name: 'Nuevo Ingreso',
        description: 'Estudiante que apenas inicia la carrera',
        user: {
            id: 'new_student',
            name: 'Ana García',
            email: 'ana.garcia@alumno.iaev.mx',
            role: 'student',
            xp: 0,
            level: 1,
            cuatrimestre: 1,
            achievements: [],
            completedLessons: [],
            completedQuizzes: [],
            assignedCourses: []
        },
        curriculum: [
            {
                id: 1,
                name: 'Primer Cuatrimestre',
                status: 'current',
                subjects: baseSubjects.filter(s => s.quarter === 1).map(s => ({ ...s, status: 'enrolled' }))
            },
            {
                id: 2,
                name: 'Segundo Cuatrimestre',
                status: 'future',
                subjects: baseSubjects.filter(s => s.quarter === 2).map(s => ({ ...s, status: 'pending' }))
            },
            {
                id: 3,
                name: 'Tercer Cuatrimestre',
                status: 'future',
                subjects: baseSubjects.filter(s => s.quarter === 3).map(s => ({ ...s, status: 'pending' }))
            },
            {
                id: 4,
                name: 'Cuarto Cuatrimestre',
                status: 'future',
                subjects: baseSubjects.filter(s => s.quarter === 4).map(s => ({ ...s, status: 'pending' }))
            }
        ]
    },
    {
        id: 'advanced_student',
        name: 'Estudiante Avanzado',
        description: 'Estudiante en 4to cuatrimestre con buen promedio',
        user: {
            id: 'advanced_student',
            name: 'Carlos López',
            email: 'carlos.lopez@alumno.iaev.mx',
            role: 'student',
            xp: 15000,
            level: 15,
            cuatrimestre: 4,
            achievements: [
                { id: 'first_lesson', title: 'Primeros Pasos', description: 'Completa tu primera lección', icon: 'footsteps-outline', unlockedAt: new Date().toISOString() },
                { id: 'level_5', title: 'Dedicado', description: 'Alcanza el nivel 5', icon: 'star-outline', unlockedAt: new Date().toISOString() }
            ],
            completedLessons: [1, 2, 3, 4, 5],
            completedQuizzes: [1, 2],
            assignedCourses: [1, 2]
        },
        curriculum: [
            {
                id: 1,
                name: 'Primer Cuatrimestre',
                status: 'completed',
                average: 9.5,
                subjects: baseSubjects.filter(s => s.quarter === 1).map(s => ({ ...s, status: 'completed', grade: 9.5 }))
            },
            {
                id: 2,
                name: 'Segundo Cuatrimestre',
                status: 'completed',
                average: 9.2,
                subjects: baseSubjects.filter(s => s.quarter === 2).map(s => ({ ...s, status: 'completed', grade: 9.2 }))
            },
            {
                id: 3,
                name: 'Tercer Cuatrimestre',
                status: 'completed',
                average: 9.0,
                subjects: baseSubjects.filter(s => s.quarter === 3).map(s => ({ ...s, status: 'completed', grade: 9.0 }))
            },
            {
                id: 4,
                name: 'Cuarto Cuatrimestre',
                status: 'current',
                subjects: baseSubjects.filter(s => s.quarter === 4).map(s => ({ ...s, status: 'enrolled' }))
            }
        ]
    },
    {
        id: 'irregular_student',
        name: 'Estudiante Irregular',
        description: 'Estudiante con materias reprobadas y pendientes',
        user: {
            id: 'irregular_student',
            name: 'Roberto Díaz',
            email: 'roberto.diaz@alumno.iaev.mx',
            role: 'student',
            xp: 5000,
            level: 5,
            cuatrimestre: 2,
            achievements: [],
            completedLessons: [1, 2],
            completedQuizzes: [],
            assignedCourses: [1]
        },
        curriculum: [
            {
                id: 1,
                name: 'Primer Cuatrimestre',
                status: 'completed', // Technically completed the term, but has failed subjects
                average: 7.5,
                subjects: baseSubjects.filter(s => s.quarter === 1).map(s => {
                    if (s.id === 'MAT101') return { ...s, status: 'completed', grade: 6.0 }; // Barely passed
                    if (s.id === 'PRO101') return { ...s, status: 'pending' }; // Failed/Retake
                    return { ...s, status: 'completed', grade: 8.0 };
                })
            },
            {
                id: 2,
                name: 'Segundo Cuatrimestre',
                status: 'current',
                subjects: baseSubjects.filter(s => s.quarter === 2).map(s => ({ ...s, status: 'enrolled' }))
            },
            {
                id: 3,
                name: 'Tercer Cuatrimestre',
                status: 'future',
                subjects: baseSubjects.filter(s => s.quarter === 3).map(s => ({ ...s, status: 'pending' }))
            },
            {
                id: 4,
                name: 'Cuarto Cuatrimestre',
                status: 'future',
                subjects: baseSubjects.filter(s => s.quarter === 4).map(s => ({ ...s, status: 'pending' }))
            }
        ]
    }
];
