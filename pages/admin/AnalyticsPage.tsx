import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Group } from '../../types';

const AnalyticsPage: React.FC = () => {
    const { getGlobalStats } = useAcademic();
    const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
    const [selectedQuarter, setSelectedQuarter] = useState<number | undefined>(undefined);

    const stats = getGlobalStats({ group: selectedGroup, cuatrimestre: selectedQuarter });

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analíticas Académicas</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Rendimiento en tiempo real por grupo y cuatrimestre.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                    <select
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedQuarter || ''}
                        onChange={(e) => setSelectedQuarter(e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">Todos los Cuatrimestres</option>
                        <option value="1">1º Cuatrimestre</option>
                        <option value="2">2º Cuatrimestre</option>
                        <option value="3">3º Cuatrimestre</option>
                        <option value="4">4º Cuatrimestre</option>
                    </select>

                    <select
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedGroup || ''}
                        onChange={(e) => setSelectedGroup(e.target.value ? e.target.value as Group : undefined)}
                    >
                        <option value="">Todos los Grupos</option>
                        <option value="A">Grupo A</option>
                        <option value="B">Grupo B</option>
                        <option value="C">Grupo C</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Promedio General</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageGrade}</h3>
                    <div className={`flex items-center gap-1 text-sm mt-2 font-medium ${stats.averageGrade >= 8 ? 'text-green-500' : 'text-yellow-500'}`}>
                        <ion-icon name={stats.averageGrade >= 8 ? "trending-up" : "trending-flat"}></ion-icon>
                        <span>Meta: 8.5</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Asistencia Promedio</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageAttendance}%</h3>
                    <div className={`flex items-center gap-1 text-sm mt-2 font-medium ${stats.averageAttendance >= 90 ? 'text-green-500' : 'text-red-500'}`}>
                        <ion-icon name={stats.averageAttendance >= 90 ? "checkmark-circle" : "alert-circle"}></ion-icon>
                        <span>Meta: 90%</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Estudiantes Activos</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</h3>
                    <div className="flex items-center gap-1 text-blue-500 text-sm mt-2 font-medium">
                        <ion-icon name="people-outline"></ion-icon>
                        <span>Total inscritos</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Cursos Activos</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeCourses}</h3>
                    <div className="flex items-center gap-1 text-purple-500 text-sm mt-2 font-medium">
                        <ion-icon name="library-outline"></ion-icon>
                        <span>En curso actual</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Chart Area (Mock) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white">Tendencia de Asistencia</h3>
                        <select className="bg-gray-50 dark:bg-gray-700 border-none text-sm text-gray-600 dark:text-gray-300 rounded-lg focus:ring-0 cursor-pointer px-2 py-1">
                            <option>Últimos 7 días</option>
                            <option>Último mes</option>
                            <option>Este año</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[85, 88, 82, 90, 95, 92, 88, 85, 89, 91, 93, 94].map((height, i) => (
                            <div key={i} className="w-full bg-blue-50 dark:bg-blue-900/10 rounded-t-lg relative group hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors cursor-pointer" style={{ height: '100%' }}>
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500" style={{ height: `${height}%` }}></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                                    {height}% Asistencia
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
                        <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">Rendimiento por Materia</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Matemáticas', score: 8.2, color: 'bg-orange-500' },
                            { name: 'Programación', score: 9.5, color: 'bg-blue-500' },
                            { name: 'Diseño 3D', score: 8.8, color: 'bg-cyan-500' },
                            { name: 'Inglés', score: 7.9, color: 'bg-green-500' }
                        ].map((course, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{course.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{course.score}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${course.color} rounded-full`} style={{ width: `${(course.score / 10) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                        Ver Reporte Detallado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
