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
                    buttonClass: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-200',
                    badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
                    badgeText: 'En Progreso'
                };
            case 'completed':
                return {
                    buttonText: 'Repasar',
                    buttonClass: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                    badgeClass: 'bg-green-50 text-green-600 border-green-100',
                    badgeText: 'Completado'
                };
            case 'new':
            default:
                return {
                    buttonText: 'Empezar Ahora',
                    buttonClass: 'bg-gray-900 text-white shadow-gray-200',
                    badgeClass: 'bg-yellow-50 text-yellow-600 border-yellow-100',
                    badgeText: 'Nuevo'
                };
        }
    };

    const { buttonText, buttonClass, badgeClass, badgeText } = getStatusStyles();

    return (
        <div
            className="group glass dark:glass-dark rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/50 dark:border-white/10"
        >
            <div className="p-8 flex-grow relative">
                <div className="absolute top-0 right-0 p-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${badgeClass}`}>
                        {badgeText}
                    </span>
                </div>

                <div className="mt-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                        {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        {course.subtitle}
                    </p>
                </div>
            </div>

            <div className="px-8 pb-8 pt-0">
                {course.progress > 0 && (
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            <span>Tu progreso</span>
                            <span className="text-gray-900 dark:text-white">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${course.progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => onSelectCourse(course.id)}
                    className={`w-full font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-md active:scale-[0.98] ${buttonClass}`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default CourseCard;