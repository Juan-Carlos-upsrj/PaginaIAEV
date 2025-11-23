import React from 'react';

const AnalyticsPage: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Analíticas</h1>
                <p className="text-gray-600 mt-1">Visualiza el rendimiento de tu plataforma educativa.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm font-medium mb-1">Ingresos Totales</p>
                    <h3 className="text-3xl font-bold text-gray-800">$12,450</h3>
                    <div className="flex items-center gap-1 text-green-500 text-sm mt-2 font-medium">
                        <ion-icon name="trending-up"></ion-icon>
                        <span>+15% vs mes anterior</span>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm font-medium mb-1">Nuevos Estudiantes</p>
                    <h3 className="text-3xl font-bold text-gray-800">+128</h3>
                    <div className="flex items-center gap-1 text-green-500 text-sm mt-2 font-medium">
                        <ion-icon name="trending-up"></ion-icon>
                        <span>+8% vs mes anterior</span>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm font-medium mb-1">Horas de Aprendizaje</p>
                    <h3 className="text-3xl font-bold text-gray-800">3,450</h3>
                    <div className="flex items-center gap-1 text-blue-500 text-sm mt-2 font-medium">
                        <ion-icon name="time-outline"></ion-icon>
                        <span>Promedio 4.5h/usuario</span>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-500 text-sm font-medium mb-1">Satisfacción</p>
                    <h3 className="text-3xl font-bold text-gray-800">4.8/5</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2 font-medium">
                        <ion-icon name="star"></ion-icon>
                        <span>Basado en 450 reseñas</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Chart Area (Mock) */}
                <div className="lg:col-span-2 glass p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Actividad de Estudiantes</h3>
                        <select className="bg-white/50 border-none text-sm text-gray-600 rounded-lg focus:ring-0 cursor-pointer">
                            <option>Últimos 7 días</option>
                            <option>Último mes</option>
                            <option>Este año</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group hover:bg-blue-200 transition-colors cursor-pointer" style={{ height: `${height}%` }}>
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500" style={{ height: `${height * 0.6}%` }}></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap">
                                    {height * 10} visitas
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
                <div className="glass p-6 rounded-2xl">
                    <h3 className="font-bold text-gray-800 mb-6">Cursos Populares</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Introducción a Houdini', students: 1240, color: 'bg-orange-500' },
                            { name: 'Diseño Web Moderno', students: 980, color: 'bg-blue-500' },
                            { name: 'React Avanzado', students: 850, color: 'bg-cyan-500' },
                            { name: 'Python para Data Science', students: 620, color: 'bg-green-500' }
                        ].map((course, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{course.name}</span>
                                    <span className="text-gray-500">{course.students}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${course.color} rounded-full`} style={{ width: `${(course.students / 1500) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors">
                        Ver Reporte Completo
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="font-bold text-gray-800 mb-6">Actividad Reciente</h3>
                <div className="space-y-6">
                    {[
                        { user: 'Ana García', action: 'completó el módulo', target: 'Simulaciones Básicas', time: 'Hace 15 min', icon: 'checkmark-circle', color: 'text-green-500' },
                        { user: 'Carlos López', action: 'se inscribió en', target: 'Introducción a Houdini', time: 'Hace 2 horas', icon: 'person-add', color: 'text-blue-500' },
                        { user: 'Sofia Martinez', action: 'publicó en', target: 'Comunidad', time: 'Hace 4 horas', icon: 'chatbubble', color: 'text-purple-500' },
                        { user: 'Miguel Angel', action: 'obtuvo el logro', target: 'Primeros Pasos', time: 'Hace 1 día', icon: 'trophy', color: 'text-yellow-500' }
                    ].map((activity, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${activity.color} shadow-sm`}>
                                <ion-icon name={activity.icon}></ion-icon>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.target}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
