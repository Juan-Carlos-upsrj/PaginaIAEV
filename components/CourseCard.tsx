import React from 'react';
import type { CourseSummary } from '../types';

interface CourseCardProps {
    course: CourseSummary;
    onSelectCourse: (id: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse }) => {
    const getStatusStyles = () => {
        switch (course.status) {
            case 'active':
                return {
                    buttonText: 'Continuar',
                    buttonClass: 'iaev-blue hover:opacity-90',
                    badgeClass: 'bg-blue-100 text-iaev-blue',
                    badgeText: 'Activo'
                };
            case 'completed':
                return {
                    buttonText: 'Ver de Nuevo',
                    buttonClass: 'bg-gray-600 hover:bg-gray-500',
                    badgeClass: 'bg-green-100 text-iaev-green',
                    badgeText: 'Finalizado'
                };
            case 'new':
            default:
                return {
                    buttonText: 'Empezar Curso',
                    buttonClass: 'iaev-blue hover:opacity-90',
                    badgeClass: 'bg-yellow-100 text-iaev-yellow',
                    badgeText: 'Nuevo'
                };
        }
    };
    
    const { buttonText, buttonClass, badgeClass, badgeText } = getStatusStyles();

    return (
        <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>{badgeText}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{course.subtitle}</p>
            </div>
            <div className="px-6 pb-6 bg-gray-50/50">
                {course.progress > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="iaev-green h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => onSelectCourse(course.id)}
                    className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-opacity duration-200 ${buttonClass}`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default CourseCard;