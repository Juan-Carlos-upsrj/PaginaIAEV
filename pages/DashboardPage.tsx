import React from 'react';
import { dashboardCourses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import type { CourseSummary } from '../types';

interface DashboardPageProps {
    onSelectCourse: (id: number) => void;
    onLogout: () => void;
}

const Logo: React.FC = () => (
    <span className="text-2xl font-extrabold flex">
        <span className="text-iaev-blue">I</span>
        <span className="text-iaev-yellow">A</span>
        <span className="text-iaev-green">E</span>
        <span className="text-iaev-red">V</span>
        <span className="text-gray-800 ml-1">SITE</span>
    </span>
);


const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectCourse, onLogout }) => {
    const activeCourses = dashboardCourses.filter(c => c.status === 'active');
    const completedCourses = dashboardCourses.filter(c => c.status === 'completed');
    const newCourses = dashboardCourses.filter(c => c.status === 'new');

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white sticky top-0 z-20 border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo />
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
                        >
                            <ion-icon name="log-out-outline" class="w-5 h-5"></ion-icon>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Cursos</h1>
                <div className="space-y-12">
                    {activeCourses.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Continuar Aprendiendo</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeCourses.map(course => <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />)}
                            </div>
                        </section>
                    )}
                    
                    {newCourses.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Explorar Cursos</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {newCourses.map(course => <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />)}
                            </div>
                        </section>
                    )}

                    {completedCourses.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cursos Finalizados</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedCourses.map(course => <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />)}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;