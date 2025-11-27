import React, { useState, useMemo } from 'react';
import { useAcademic, Subject } from '../../context/AcademicContext';
import { useUser } from '../../context/UserContext';
import { UserProfile } from '../../types';

const AdminUsersPage: React.FC = () => {
    const { teachers, createTeacher, assignCourseToTeacher, quarters } = useAcademic();
    const { courses } = useUser();

    // State for creating teacher
    const [isCreating, setIsCreating] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        password: '',
        bio: ''
    });

    // State for assigning course
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Flatten all subjects from all quarters for the search list
    const allSubjects = useMemo(() => {
        const subjects: (Subject & { quarterName: string })[] = [];
        quarters.forEach(q => {
            q.subjects.forEach(s => {
                subjects.push({ ...s, quarterName: q.name });
            });
        });
        return subjects;
    }, [quarters]);

    const filteredSubjects = allSubjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const openAssignModal = (teacherId: string) => {
        setSelectedTeacherId(teacherId);
        setIsAssigning(true);
        setSearchTerm('');
    };

    const handleAssignSubject = (subjectId: string) => {
        if (selectedTeacherId) {
            // We use a simple hash or the subject ID itself as the "courseId" number for now, 
            // since the system expects a number but subjects have string IDs (e.g., 'MAT101').
            // To make it work with the existing type definition (number), we might need to adjust types.ts 
            // or just hash it. For this demo, let's assume we can map string IDs to numbers or 
            // temporarily cast it if the system is flexible, BUT `assignCourseToTeacher` expects a number.
            // Let's generate a pseudo-random ID based on the string to keep it consistent.

            // Simple hash function for demo purposes
            let hash = 0;
            for (let i = 0; i < subjectId.length; i++) {
                hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
            }
            const numericId = Math.abs(hash);

            assignCourseToTeacher(selectedTeacherId, numericId);
            setIsAssigning(false);
            setSelectedTeacherId(null);
        }
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                    <ion-icon name="person-add-outline"></ion-icon>
                    Nuevo Profesor
                </button>
            </div>

            {/* Create Teacher Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Registrar Nuevo Profesor</h2>
                        <form onSubmit={handleCreateTeacher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional (@iaev.mx)</label>
                                <input
                                    type="email"
                                    required
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Temporal</label>
                                <input
                                    type="password"
                                    required
                                    value={newTeacher.password}
                                    onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Crear Cuenta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Course Modal */}
            {isAssigning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Asignar Materia</h2>
                            <button onClick={() => setIsAssigning(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="relative">
                                <ion-icon name="search-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
                                <input
                                    type="text"
                                    placeholder="Buscar materia por nombre o código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map(subject => (
                                    <button
                                        key={subject.id}
                                        onClick={() => handleAssignSubject(subject.id)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-800 transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{subject.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{subject.id} • {subject.quarterName}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-300">
                                                {subject.credits} Créditos
                                            </span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No se encontraron materias.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Teachers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={teacher.avatar || `https://ui-avatars.com/api/?name=${teacher.name}`}
                                    alt={teacher.name}
                                    className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-sm"
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
                                    {teacher.assignedCourses.map(courseId => {
                                        // Try to find subject name if possible, otherwise show ID
                                        // Since we hashed the ID, we can't easily reverse it without a lookup map.
                                        // For this demo, we'll just show "Materia Asignada" or the ID.
                                        // Ideally we would store the string ID in assignedCourses, but types.ts says number[].
                                        return (
                                            <span key={courseId} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md border border-blue-100 dark:border-blue-800">
                                                Materia #{courseId}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Sin asignaciones</p>
                            )}

                            <div className="mt-4 pt-2">
                                <button
                                    className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                                    onClick={() => openAssignModal(teacher.id)}
                                >
                                    <ion-icon name="add-circle-outline"></ion-icon>
                                    Asignar Materia
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
