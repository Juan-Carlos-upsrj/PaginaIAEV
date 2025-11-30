import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-transparent flex">
            {/* Sidebar */}
            <aside className="w-64 glass flex-shrink-0 hidden md:flex flex-col m-4 rounded-2xl">
                <div className="p-6 border-b border-white/20">
                    <div className="mb-4 transform hover:scale-105 transition-transform duration-300 inline-block">
                        <span className="text-3xl font-extrabold flex tracking-tight drop-shadow-sm">
                            <span className="text-iaev-blue">I</span>
                            <span className="text-iaev-yellow">A</span>
                            <span className="text-iaev-green">E</span>
                            <span className="text-iaev-red">V</span>
                            <span className="text-gray-700 ml-2">SITE</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Panel Docente</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => navigate('/admin')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all font-medium"
                    >
                        <ion-icon name="grid-outline" class="w-5 h-5"></ion-icon>
                        Mis Cursos
                    </button>
                    <button
                        onClick={() => navigate('/admin/students')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all font-medium"
                    >
                        <ion-icon name="people-outline" class="w-5 h-5"></ion-icon>
                        Estudiantes
                    </button>
                    <button
                        onClick={() => navigate('/admin/analytics')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition-all font-medium"
                    >
                        <ion-icon name="stats-chart-outline" class="w-5 h-5"></ion-icon>
                        Analíticas
                    </button>
                </nav>
                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium mb-2"
                    >
                        <ion-icon name="arrow-back-circle-outline" class="w-5 h-5"></ion-icon>
                        Vista Estudiante
                    </button>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                        <ion-icon name="log-out-outline" class="w-5 h-5"></ion-icon>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="sticky top-4 z-50 mx-4 rounded-2xl glass shadow-sm">
                    <div className="h-16 flex items-center justify-between px-6 md:px-8">
                        <div className="md:hidden">
                            {/* Mobile Menu Button Placeholder */}
                            <button className="text-gray-600">
                                <ion-icon name="menu-outline" class="w-6 h-6"></ion-icon>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                    {user?.name.substring(0, 2).toUpperCase() || 'AD'}
                                </div>
                                {user?.name || 'Profesor'}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
