import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';

import { useUser } from '../../context/UserContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { courses, deleteCourse } = useCourses();
    const { user } = useUser();

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
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h1>
                    <p className="text-gray-600 mt-1">Crea y administra tu contenido educativo.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/course/new')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
                >
                    <ion-icon name="add-circle-outline" class="w-5 h-5"></ion-icon>
                    Crear Nuevo Curso
                </button>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl">
                    <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <ion-icon name="library-outline" class="w-8 h-8"></ion-icon>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">No hay cursos asignados</h3>
                    <p className="text-gray-600 mt-1 mb-6">No tienes cursos asignados o creados todavía.</p>
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
                        <div key={course.id} className="glass p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-lg transition-shadow">
                            <div className="w-full sm:w-48 h-32 bg-white/30 rounded-xl overflow-hidden flex-shrink-0 relative group">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-gray-500">
                                        <ion-icon name="image-outline" class="w-8 h-8"></ion-icon>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-800 truncate">{course.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
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
                                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white/50 hover:bg-white/70 rounded-lg transition-colors border border-white/60"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de eliminar este curso?')) {
                                            deleteCourse(course.id);
                                        }
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
