import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface AcademicContextType {
    quarters: Quarter[];
    currentQuarter: Quarter | undefined;
    gpa: number;
    progress: number;
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
    }
];

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [quarters, setQuarters] = useState<Quarter[]>(initialCurriculum);
    const [gpa, setGpa] = useState(0);
    const [progress, setProgress] = useState(0);

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

    const currentQuarter = quarters.find(q => q.status === 'current');

    return (
        <AcademicContext.Provider value={{ quarters, currentQuarter, gpa, progress }}>
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
