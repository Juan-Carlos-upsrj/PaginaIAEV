import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademic } from '../../context/AcademicContext';
import { useUser } from '../../context/UserContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { teachers, students, quarters } = useAcademic();
    const { user } = useUser();

    const stats = [
        {
            title: 'Total Docentes',
            value: teachers.length,
            icon: 'people-outline',
            color: 'bg-blue-500',
            path: '/admin/teachers'
        },
        {
            title: 'Total Alumnos',
            value: students.length,
            icon: 'school-outline',
            color: 'bg-green-500',
            path: '/admin/students'
        },
        {
            title: 'Cuatrimestres',
            value: quarters.length,
            icon: 'calendar-outline',
            color: 'bg-purple-500',
            path: null
        },
        {
            title: 'Materias Activas',
            value: quarters.reduce((acc, q) => acc + q.subjects.length, 0),
            icon: 'book-outline',
            color: 'bg-orange-500',
            path: null
        }
    ];

    // Get current teacher's assigned courses
    const currentTeacher = teachers.find(t => t.email === user?.email);
    const myCourses = currentTeacher?.assignedCourses || [];

    const getSubjectDetails = (courseId: number) => {
        for (const quarter of quarters) {
            const subject = quarter.subjects.find(s => s.id === courseId.toString()); // Assuming courseId matches subject id
            if (subject) return { ...subject, quarterName: quarter.name };
        }
        return null;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenido, {user?.name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => stat.path && navigate(stat.path)}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all ${stat.path ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-white`}>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${stat.color}`}>
                                    <ion-icon name={stat.icon} style={{ fontSize: '20px' }}></ion-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden group cursor-pointer"
                    onClick={() => navigate('/admin/teachers')}>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Gestionar Docentes</h3>
                        <p className="text-blue-100 mb-4">Administra profesores y asignaciones de materias.</p>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2">
                            Ver Docentes
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                        <ion-icon name="people" style={{ fontSize: '150px' }}></ion-icon>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg shadow-green-500/30 relative overflow-hidden group cursor-pointer"
                    onClick={() => navigate('/admin/students')}>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Gestionar Alumnos</h3>
                        <p className="text-green-100 mb-4">Administra estudiantes, grupos y autorizaciones.</p>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2">
                            Ver Alumnos
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                        <ion-icon name="school" style={{ fontSize: '150px' }}></ion-icon>
                    </div>
                </div>
            </div>

            {/* My Courses Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mis Materias Asignadas</h3>
                    <button
                        onClick={() => navigate('/admin/course/new')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <ion-icon name="add-circle-outline"></ion-icon>
                        Nueva Materia
                    </button>
                </div>
                <div className="p-6">
                    {myCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myCourses.map(courseId => {
                                const details = getSubjectDetails(courseId);
                                return (
                                    <div key={courseId} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => navigate(`/admin/course/${courseId}`)}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <ion-icon name="book-outline" style={{ fontSize: '24px' }}></ion-icon>
                                            </div>
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-300">
                                                {details?.quarterName || 'N/A'}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {details?.name || `Materia #${courseId}`}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {details?.credits} Créditos • ID: {courseId}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-300 dark:text-gray-600 mb-3">
                                <ion-icon name="library-outline" style={{ fontSize: '48px' }}></ion-icon>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">No tienes materias asignadas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
