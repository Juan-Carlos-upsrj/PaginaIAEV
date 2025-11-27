import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useUser } from '../../context/UserContext';
import { useAcademic } from '../../context/AcademicContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { courses, deleteCourse } = useCourses();
    const { user } = useUser();
    const { getGlobalStats } = useAcademic();

    const stats = getGlobalStats();

    // Filter courses based on user role
    const filteredCourses = courses.filter(course => {
        // If user is super admin (optional logic, for now just check assignments)
        if (user?.email === 'admin@iaev.mx') return true;

        // Check if course is assigned to this teacher
        const isAssigned = user?.assignedCourses?.includes(course.id);
        const isInstructor = course.instructorId === user?.id;

        return isAssigned || isInstructor;
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header & Stats */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Visión general del rendimiento académico.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <ion-icon name="people-outline"></ion-icon>
                            Gestionar Docentes
                        </button>
                        <button
                            onClick={() => navigate('/admin/course/new')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                        >
                            <ion-icon name="add-circle-outline"></ion-icon>
                            Nuevo Curso
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                <ion-icon name="school-outline" style={{ fontSize: '24px' }}></ion-icon>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Promedio General</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageGrade}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                                <ion-icon name="calendar-outline" style={{ fontSize: '24px' }}></ion-icon>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Asistencia</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageAttendance}%</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                <ion-icon name="people-outline" style={{ fontSize: '24px' }}></ion-icon>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Alumnos Activos</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
                                <ion-icon name="library-outline" style={{ fontSize: '24px' }}></ion-icon>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cursos Activos</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCourses}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mis Cursos</h2>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ion-icon name="library-outline" class="w-8 h-8"></ion-icon>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay cursos asignados</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">No tienes cursos asignados o creados todavía.</p>
                    <button
                        onClick={() => navigate('/admin/course/new')}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Crear Curso
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                            <div className="w-full sm:w-48 h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 relative group">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-gray-500 dark:text-gray-400">
                                        <ion-icon name="image-outline" class="w-8 h-8"></ion-icon>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{course.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <ion-icon name="layers-outline"></ion-icon>
                                        {course.modules.length} Módulos
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ion-icon name="videocam-outline"></ion-icon>
                                        {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lecciones
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                <button
                                    onClick={() => navigate(`/admin/course/${course.id}`)}
                                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de eliminar este curso?')) {
                                            deleteCourse(course.id);
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Eliminar curso"
                                >
                                    <ion-icon name="trash-outline" class="w-5 h-5"></ion-icon>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
