import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCourses } from '../context/CourseContext';
import ThemeToggle from '../components/ThemeToggle';
import GlobalSearch from '../components/GlobalSearch';

const DashboardPage: React.FC = () => {
    const { user, logout } = useUser();
    const { summaries: dashboardCourses } = useCourses();
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Buenos días');
        else if (hour < 18) setGreeting('Buenas tardes');
        else setGreeting('Buenas noches');
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Header */}
            <header className="sticky top-4 z-50 mx-4 mb-8 rounded-2xl glass shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                                IA
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                                IAEV Online
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <nav className="hidden md:flex items-center gap-1">
                                <a href="/dashboard" className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-medium transition-all">
                                    Inicio
                                </a>
                                <a href="/courses" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Cursos
                                </a>
                                <a href="/community" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Comunidad
                                </a>
                                <a href="/bookmarks" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Marcadores
                                </a>
                                <a href="/calendar" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Calendario
                                </a>
                                <a href="/kardex" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Kardex
                                </a>
                            </nav>

                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

                            <div className="flex items-center gap-3">
                                <GlobalSearch />
                                <ThemeToggle />
                                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group">
                                    <ion-icon name="notifications-outline" class="w-6 h-6 text-gray-600 dark:text-gray-300"></ion-icon>
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                                </button>

                                <div className="relative group">
                                    <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-lg shadow-sm"
                                        />
                                        <ion-icon name="chevron-down-outline" class="w-4 h-4 text-gray-400"></ion-icon>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                                        <div className="p-2">
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                <ion-icon name="log-out-outline"></ion-icon>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user.name.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Tienes <span className="font-bold text-gray-900 dark:text-white">2 tareas pendientes</span> para hoy. ¡A darle con todo!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Continue Learning */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ion-icon name="play-circle" class="text-blue-600"></ion-icon>
                                    Continuar Aprendiendo
                                </h2>
                            </div>

                            {/* Course Card */}
                            <div className="glass dark:glass-dark rounded-3xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/50 dark:border-white/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>

                                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
                                    <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shadow-lg relative group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
                                            alt="Course"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-110 transition-all duration-300">
                                                <ion-icon name="play" class="text-blue-600 text-xl ml-1"></ion-icon>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                                En Progreso
                                            </span>
                                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">75%</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                            Introducción a Houdini
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            Domina los fundamentos de la generación procedural y efectos visuales.
                                        </p>

                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full w-3/4 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse"></div>
                                        </div>

                                        <button onClick={() => navigate('/course/2')} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                                            Reanudar Lección <ion-icon name="arrow-forward"></ion-icon>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Recommended Courses */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <ion-icon name="compass" class="text-purple-600"></ion-icon>
                                Explorar Cursos
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {(dashboardCourses || []).map((course) => (
                                    <div key={course.id} className="glass dark:glass-dark p-4 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-white/50 dark:border-white/10">
                                        <div className="h-40 rounded-xl overflow-hidden mb-4 relative">
                                            <img src={course.thumbnail || course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-white shadow-sm flex items-center gap-1">
                                                <ion-icon name="star" class="text-yellow-400"></ion-icon> 4.8
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{course.subtitle}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {course.status === 'new' ? 'Nuevo' : 'En progreso'}
                                            </div>
                                            <button onClick={() => navigate(`/course/${course.id}`)} className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-900/20">
                                                Ver Curso
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* Stats Widget */}
                        <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/50 dark:border-white/10">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ion-icon name="stats-chart" class="text-green-500"></ion-icon>
                                Tu Progreso
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <ion-icon name="time"></ion-icon>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Horas Aprendidas</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">12.5h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <ion-icon name="trophy"></ion-icon>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cursos Completados</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">2</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Deadlines Widget */}
                        <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/50 dark:border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ion-icon name="calendar" class="text-red-500"></ion-icon>
                                    Próximas Entregas
                                </h3>
                                <a href="/calendar" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Ver todo</a>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex gap-3 items-start">
                                    <div className="mt-1 min-w-[4px] h-8 bg-red-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Proyecto Final: Modelado 3D</p>
                                        <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">Vence: Mañana, 11:59 PM</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 flex gap-3 items-start">
                                    <div className="mt-1 min-w-[4px] h-8 bg-yellow-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Quiz: Iluminación Básica</p>
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-1">Vence: 25 Nov</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;