import React from 'react';
import { useUser } from '../../context/UserContext';
import { useAcademic } from '../../context/AcademicContext';

interface Student {
    id: string;
    name: string;
    email: string;
    enrolledCourses: number;
    progress: number;
    lastActive: string;
    status: 'active' | 'inactive';
}

const mockStudents: Student[] = [
    {
        id: '0000124',
        name: 'Ana García',
        email: '0000124@alumno.iaev.mx',
        enrolledCourses: 3,
        progress: 75,
        lastActive: 'Hace 2 horas',
        status: 'active'
    },
    {
        id: '0000125',
        name: 'Carlos López',
        email: '0000125@alumno.iaev.mx',
        enrolledCourses: 2,
        progress: 30,
        lastActive: 'Hace 1 día',
        status: 'active'
    },
    {
        id: '0000126',
        name: 'Sofia Martinez',
        email: '0000126@alumno.iaev.mx',
        enrolledCourses: 4,
        progress: 90,
        lastActive: 'Hace 5 minutos',
        status: 'active'
    },
    {
        id: '0000127',
        name: 'Miguel Angel',
        email: '0000127@alumno.iaev.mx',
        enrolledCourses: 1,
        progress: 10,
        lastActive: 'Hace 1 semana',
        status: 'inactive'
    }
];

const StudentsPage: React.FC = () => {
    const { students } = useAcademic();

    // Transform UserProfile to the display format expected by the table
    const allStudents = students.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        enrolledCourses: 4, // Mock value as we don't track enrollments fully yet
        progress: Math.min(100, (s.level || 1) * 5), // Estimate progress based on level
        lastActive: 'Reciente',
        status: 'active' as const
    }));

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Estudiantes</h1>
                    <p className="text-gray-600 mt-1">Gestiona y monitorea el progreso de tus alumnos.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <ion-icon name="download-outline"></ion-icon>
                        Exportar
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20">
                        <ion-icon name="person-add-outline"></ion-icon>
                        Invitar Alumno
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                        <ion-icon name="people"></ion-icon>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Estudiantes</p>
                        <h3 className="text-2xl font-bold text-gray-800">{allStudents.length + 120}</h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl">
                        <ion-icon name="pulse"></ion-icon>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Activos Hoy</p>
                        <h3 className="text-2xl font-bold text-gray-800">45</h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl">
                        <ion-icon name="trophy"></ion-icon>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tasa de Finalización</p>
                        <h3 className="text-2xl font-bold text-gray-800">85%</h3>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="glass rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-white/20 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Lista de Alumnos</h3>
                    <div className="relative">
                        <ion-icon name="search-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
                        <input
                            type="text"
                            placeholder="Buscar estudiante..."
                            className="pl-10 pr-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/30 border-b border-white/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estudiante</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cursos</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progreso Promedio</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {allStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-white/40 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                                {student.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.enrolledCourses}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {student.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Ver Perfil</button>
                                        <button className="text-gray-400 hover:text-red-600">
                                            <ion-icon name="trash-outline"></ion-icon>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/20 flex justify-between items-center text-sm text-gray-500">
                    <span>Mostrando {allStudents.length} de {allStudents.length + 120} estudiantes</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentsPage;
