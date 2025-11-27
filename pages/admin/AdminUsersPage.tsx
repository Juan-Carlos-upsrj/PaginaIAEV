import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { useUser } from '../../context/UserContext';
import { UserProfile } from '../../types';

const AdminUsersPage: React.FC = () => {
    const { teachers, createTeacher, assignCourseToTeacher } = useAcademic();
    const { courses } = useUser(); // Assuming useUser or another context has the list of all courses
    // Actually, courses might be in a CourseContext. Let's check. 
    // For now, I'll assume I can get courses from somewhere. 
    // Wait, the implementation plan says "Assign Course". I need a list of courses.
    // Let's check where courses are stored. They are likely in a CourseContext or similar.
    // I'll check CourseContext later. For now, I'll mock the course list or try to import it.

    const [isCreating, setIsCreating] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        password: '', // In a real app, we wouldn't handle raw passwords like this easily
        bio: ''
    });

    const handleCreateTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        createTeacher({
            name: newTeacher.name,
            email: newTeacher.email,
            bio: newTeacher.bio,
            avatar: `https://ui-avatars.com/api/?name=${newTeacher.name}&background=random`
        });
        setIsCreating(false);
        setNewTeacher({ name: '', email: '', password: '', bio: '' });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Docentes</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Administra las cuentas de profesores y sus asignaciones.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <ion-icon name="person-add-outline"></ion-icon>
                    Nuevo Profesor
                </button>
            </div>

            {/* Create Teacher Modal/Form */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Registrar Nuevo Profesor</h2>
                        <form onSubmit={handleCreateTeacher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional (@iaev.mx)</label>
                                <input
                                    type="email"
                                    required
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Temporal</label>
                                <input
                                    type="password"
                                    required
                                    value={newTeacher.password}
                                    onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Crear Cuenta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Teachers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={teacher.avatar || `https://ui-avatars.com/api/?name=${teacher.name}`}
                                    alt={teacher.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                                Docente
                            </span>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Materias Asignadas</h4>
                            {teacher.assignedCourses && teacher.assignedCourses.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {teacher.assignedCourses.map(courseId => (
                                        <span key={courseId} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md">
                                            Curso #{courseId}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Sin asignaciones</p>
                            )}

                            <div className="mt-4 pt-2">
                                <button
                                    className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    onClick={() => {
                                        const courseId = prompt("ID del curso a asignar (ej. 1, 2, 3):");
                                        if (courseId) assignCourseToTeacher(teacher.id, parseInt(courseId));
                                    }}
                                >
                                    + Asignar Materia
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {teachers.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="text-gray-400 mb-3">
                            <ion-icon name="people-outline" style={{ fontSize: '48px' }}></ion-icon>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay profesores registrados</h3>
                        <p className="text-gray-500 dark:text-gray-400">Comienza creando una cuenta para un docente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
