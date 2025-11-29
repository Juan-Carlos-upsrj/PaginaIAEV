import React, { useState, useMemo } from 'react';
import { useAcademic, Subject } from '../../context/AcademicContext';
import { UserProfile } from '../../types';

const AdminTeachersPage: React.FC = () => {
    const {
        teachers,
        createTeacher,
        assignCourseToTeacher,
        quarters,
        updateTeacher
    } = useAcademic();

    // State for creating user
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
    const [selectedQuarter, setSelectedQuarter] = useState<number | 'all'>('all');

    // Edit States
    const [editingTeacher, setEditingTeacher] = useState<UserProfile | null>(null);

    // Flatten all subjects from all quarters for the search list
    const allSubjects = useMemo(() => {
        const subjects: (Subject & { quarterName: string; quarterId: number })[] = [];
        quarters.forEach(q => {
            q.subjects.forEach(s => {
                // Filter out English and Human Development subjects
                const nameLower = s.name.toLowerCase();
                if (!nameLower.includes('inglés') && !nameLower.includes('desarrollo humano')) {
                    subjects.push({ ...s, quarterName: q.name, quarterId: q.id });
                }
            });
        });
        return subjects;
    }, [quarters]);

    const filteredSubjects = allSubjects.filter(subject => {
        const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesQuarter = selectedQuarter === 'all' || subject.quarterId === selectedQuarter;
        return matchesSearch && matchesQuarter;
    });

    // Group filtered subjects by quarter for display
    const subjectsByQuarter = useMemo(() => {
        const groups: Record<string, typeof filteredSubjects> = {};
        filteredSubjects.forEach(subject => {
            if (!groups[subject.quarterName]) {
                groups[subject.quarterName] = [];
            }
            groups[subject.quarterName].push(subject);
        });
        return groups;
    }, [filteredSubjects]);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        createTeacher({
            name: newTeacher.name,
            email: newTeacher.email,
            bio: newTeacher.bio,
            avatar: `https://ui-avatars.com/api/?name=${newTeacher.name}&background=random`
        });
        setNewTeacher({ name: '', email: '', password: '', bio: '' });
        setIsCreating(false);
    };

    const openAssignModal = (teacherId: string) => {
        setSelectedTeacherId(teacherId);
        setIsAssigning(true);
        setSearchTerm('');
        setSelectedQuarter('all');
    };

    const handleAssignSubject = (subjectId: string) => {
        if (selectedTeacherId) {
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

    const handleUpdateTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTeacher) {
            updateTeacher(editingTeacher);
            setEditingTeacher(null);
        }
    };

    const getSubjectName = (id: number) => {
        return `Materia #${id}`;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Docentes</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Administra las cuentas de profesores y sus asignaciones.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <ion-icon name="person-add-outline"></ion-icon>
                        Nuevo Profesor
                    </button>
                </div>
            </div>

            {/* Content */}
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingTeacher(teacher)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar profesor"
                                >
                                    <ion-icon name="create-outline" style={{ fontSize: '20px' }}></ion-icon>
                                </button>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                                    Docente
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Materias Asignadas</h4>
                            {teacher.assignedCourses && teacher.assignedCourses.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {teacher.assignedCourses.map(courseId => (
                                        <span key={courseId} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md border border-blue-100 dark:border-blue-800">
                                            {getSubjectName(courseId)}
                                        </span>
                                    ))}
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            No hay profesores registrados
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Comienza creando una cuenta para un docente.
                        </p>
                    </div>
                )}
            </div>

            {/* Create Teacher Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Registrar Nuevo Profesor
                        </h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
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
                                    Crear Profesor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Teacher Modal */}
            {editingTeacher && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar Profesor</h2>
                        <form onSubmit={handleUpdateTeacher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={editingTeacher.name}
                                    onChange={e => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
                                <input
                                    type="email"
                                    required
                                    value={editingTeacher.email}
                                    onChange={e => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biografía</label>
                                <textarea
                                    value={editingTeacher.bio || ''}
                                    onChange={e => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingTeacher(null)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Guardar Cambios
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

                        <div className="mb-4 space-y-3">
                            {/* Quarter Filter */}
                            <select
                                value={selectedQuarter}
                                onChange={(e) => setSelectedQuarter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">Todos los Cuatrimestres</option>
                                {quarters.map(q => (
                                    <option key={q.id} value={q.id}>{q.name}</option>
                                ))}
                            </select>

                            {/* Search Bar */}
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

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {Object.keys(subjectsByQuarter).length > 0 ? (
                                Object.entries(subjectsByQuarter).map(([quarterName, subjects]) => (
                                    <div key={quarterName}>
                                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1 z-10">
                                            {quarterName}
                                        </h3>
                                        <div className="space-y-2">
                                            {subjects.map(subject => (
                                                <button
                                                    key={subject.id}
                                                    onClick={() => handleAssignSubject(subject.id)}
                                                    className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-800 transition-all group"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{subject.name}</h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{subject.id}</p>
                                                        </div>
                                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-300">
                                                            {subject.credits} Créditos
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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
        </div>
    );
};

export default AdminTeachersPage;
