import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCourses } from '../context/CourseContext';
import GlobalSearch from '../components/GlobalSearch';
import ThemeToggle from '../components/ThemeToggle';

const DashboardPage: React.FC = () => {
    const { user, logout } = useUser();
    const { courses } = useCourses();
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

    // Calculate dynamic stats
    const completedLessonsCount = user?.completedLessons.length || 0;
    const hoursLearned = Math.round((completedLessonsCount * 15) / 60); // Approx 15 mins per lesson

    // Determine active course
    const activeCourseId = user?.assignedCourses?.[0];
    const activeCourse = activeCourseId
        ? courses.find(c => c.id === Number(activeCourseId))
        : courses[0];

    // Calculate active course progress
    const activeCourseProgress = activeCourse ? (() => {
        const totalLessons = activeCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        if (totalLessons === 0) return 0;
        const completedInCourse = activeCourse.modules.flatMap(m => m.lessons).filter(l => user?.completedLessons.includes(l.id)).length;
        return Math.round((completedInCourse / totalLessons) * 100);
    })() : 0;

    // Filter courses for recommendations (exclude active course and filter by cuatrimestre)
    const recommendedCourses = courses.filter(c =>
        c.id !== activeCourse?.id &&
        (c.cuatrimestre === user?.cuatrimestre || c.cuatrimestre === 0)
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
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
                                <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-medium transition-all">
                                    Inicio
                                </Link>
                                <Link to="/courses" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Cursos
                                </Link>
                                <Link to="/community" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Comunidad
                                </Link>
                                <Link to="/bookmarks" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Marcadores
                                </Link>
                                <Link to="/calendar" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Calendario
                                </Link>
                                <Link to="/kardex" className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Kardex
                                </Link>
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
                                            <Link to="/profile" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <ion-icon name="person-outline"></ion-icon>
                                                Mi Perfil
                                            </Link>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user.name.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Tienes <span className="font-bold text-gray-900 dark:text-white">2 tareas pendientes</span> para hoy. ¡A darle con todo!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Progress Card */}
                    <div className="lg:col-span-2">
                        {activeCourse ? (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 uppercase tracking-wider">
                                                Continuar Aprendiendo
                                            </span>
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                {activeCourse.title}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                                {activeCourse.description}
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl">
                                            <ion-icon name="code-slash-outline"></ion-icon>
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-4 mb-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{activeCourseProgress}%</span>
                                        <span className="text-gray-400 mb-2">completado</span>
                                    </div>

                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-8 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${activeCourseProgress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/course/${activeCourse.id}/learn`)}
                                        className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2 group/btn"
                                    >
                                        Continuar Lección
                                        <ion-icon name="arrow-forward-outline" class="group-hover/btn:translate-x-1 transition-transform"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100 dark:border-gray-700 flex items-center justify-center h-full">
                                <p className="text-gray-500">No tienes cursos asignados aún.</p>
                            </div>
                        )}
                    </div>

                    {/* Stats Widget */}
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Tu Progreso</h3>
                                <p className="text-blue-100 text-sm">Esta semana</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-8">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                    <div className="text-3xl font-bold mb-1">{hoursLearned}h</div>
                                    <div className="text-xs text-blue-100">Aprendidas</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                    <div className="text-3xl font-bold mb-1">{completedLessonsCount}</div>
                                    <div className="text-xs text-blue-100">Lecciones</div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Promedio General</span>
                                    <span className="font-bold">9.8</span>
                                </div>
                                <div className="w-full bg-black/20 rounded-full h-2">
                                    <div className="bg-white h-full rounded-full w-[98%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Courses */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Explorar Cursos</h2>
                            <p className="text-gray-500 dark:text-gray-400">Recomendados para ti basados en tus intereses</p>
                        </div>
                        <Link to="/courses" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                            Ver todos <ion-icon name="arrow-forward-outline"></ion-icon>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedCourses.map((course) => (
                            <div key={course.id} className="glass dark:glass-dark p-4 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-white/50 dark:border-white/10">
                                <div className="h-40 rounded-xl overflow-hidden mb-4 relative">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-white shadow-sm flex items-center gap-1">
                                        <ion-icon name="star" class="text-yellow-400"></ion-icon> 4.8
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{course.subtitle}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {course.modules.length} Módulos
                                    </div>
                                    <button onClick={() => navigate(`/course/${course.id}`)} className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-900/20">
                                        Ver Curso
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;