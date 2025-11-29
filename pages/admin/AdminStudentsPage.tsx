import React, { useState, useMemo } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { UserProfile } from '../../types';

const AdminStudentsPage: React.FC = () => {
    const {
        students,
        allowedEmails,
        authorizeStudent,
        quarters,
        groups,
        addGroup,
        removeGroup,
        updateGroup,
        updateStudent
    } = useAcademic();

    // UI State
    const [activeTab, setActiveTab] = useState<'students' | 'groups'>('students');

    // State for creating user
    const [isCreating, setIsCreating] = useState(false);
    const [authEmail, setAuthEmail] = useState('');

    // State for creating group
    const [newGroup, setNewGroup] = useState('');

    // Edit States
    const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
    const [editingGroup, setEditingGroup] = useState<{ original: string, current: string } | null>(null);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        authorizeStudent(authEmail.trim().toLowerCase());
        setAuthEmail('');
        setIsCreating(false);
    };

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGroup.trim()) {
            addGroup(newGroup);
            setNewGroup('');
        }
    };

    const handleUpdateStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStudent) {
            updateStudent(editingStudent);
            setEditingStudent(null);
        }
    };

    const handleUpdateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGroup) {
            updateGroup(editingGroup.original, editingGroup.current);
            setEditingGroup(null);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Alumnos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Administra los estudiantes y grupos académicos.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setActiveTab('students'); setIsCreating(true); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/30"
                    >
                        <ion-icon name="school-outline"></ion-icon>
                        Autorizar Alumno
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'students' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Estudiantes
                    {activeTab === 'students' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'groups' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Grupos
                    {activeTab === 'groups' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'groups' ? (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Crear Nuevo Grupo</h3>
                        <form onSubmit={handleCreateGroup} className="flex gap-4">
                            <input
                                type="text"
                                value={newGroup}
                                onChange={(e) => setNewGroup(e.target.value)}
                                placeholder="Nombre del grupo (ej. E, IC-2024)"
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={!newGroup.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Agregar
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {groups.map(group => (
                            <div key={group} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center group hover:shadow-md transition-all">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{group}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => setEditingGroup({ original: group, current: group })}
                                        className="text-gray-400 hover:text-blue-500"
                                        title="Editar grupo"
                                    >
                                        <ion-icon name="create-outline"></ion-icon>
                                    </button>
                                    <button
                                        onClick={() => removeGroup(group)}
                                        className="text-gray-400 hover:text-red-500"
                                        title="Eliminar grupo"
                                    >
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="col-span-full mb-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Correos Autorizados</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            {allowedEmails.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {allowedEmails.map(email => (
                                        <span key={email} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm border border-green-100 dark:border-green-800 flex items-center gap-2">
                                            {email}
                                            <ion-icon name="checkmark-circle" style={{ fontSize: '16px' }}></ion-icon>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No hay correos autorizados aún. Agrega uno para permitir el registro.</p>
                            )}
                        </div>
                    </div>

                    {students.map((student) => (
                        <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}`}
                                        alt={student.name}
                                        className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{student.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingStudent(student)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar estudiante"
                                    >
                                        <ion-icon name="create-outline" style={{ fontSize: '20px' }}></ion-icon>
                                    </button>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full font-medium">
                                        Estudiante
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cuatrimestre</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{student.cuatrimestre}º</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Grupo</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{student.group}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {students.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="text-gray-400 mb-3">
                                <ion-icon name="people-outline" style={{ fontSize: '48px' }}></ion-icon>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                No hay estudiantes registrados
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Comienza autorizando un correo para que un alumno pueda registrarse.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Create User Modal (Authorize) */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Autorizar Nuevo Estudiante
                        </h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Ingresa el correo institucional del alumno. El alumno podrá registrarse usando este correo.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional (@iaev.mx)</label>
                                <input
                                    type="email"
                                    required
                                    value={authEmail}
                                    onChange={e => setAuthEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="matricula@alumno.iaev.mx"
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
                                    Autorizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar Estudiante</h2>
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={editingStudent.name}
                                    onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
                                <input
                                    type="email"
                                    required
                                    value={editingStudent.email}
                                    onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuatrimestre</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        required
                                        value={editingStudent.cuatrimestre}
                                        onChange={e => setEditingStudent({ ...editingStudent, cuatrimestre: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grupo</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingStudent.group || ''}
                                        onChange={e => setEditingStudent({ ...editingStudent, group: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
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

            {/* Edit Group Modal */}
            {editingGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar Grupo</h2>
                        <form onSubmit={handleUpdateGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Grupo</label>
                                <input
                                    type="text"
                                    required
                                    value={editingGroup.current}
                                    onChange={e => setEditingGroup({ ...editingGroup, current: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingGroup(null)}
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
        </div>
    );
};

export default AdminStudentsPage;
