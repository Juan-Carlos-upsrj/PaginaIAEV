import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useUser } from '../context/UserContext';

const CourseIntroPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { courses } = useCourses();
    const { user } = useUser();
    const navigate = useNavigate();

    const course = courses.find(c => c.id === Number(courseId));

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Curso no encontrado</h2>
                    <Link to="/dashboard" className="text-blue-600 hover:underline">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    const intro = course.intro || {
        teacherInfo: { name: "Instructor IAEV", bio: "Experto en la materia.", image: `https://ui-avatars.com/api/?name=${course.instructor || 'Instructor'}` },
        studentWork: [],
        software: [],
        hardware: { cpu: "N/A", ram: "N/A", gpu: "N/A" }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                            <ion-icon name="arrow-back-outline"></ion-icon> Volver al Dashboard
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold mb-3 uppercase tracking-wider">
                                    {course.cuatrimestre ? `${course.cuatrimestre}° Cuatrimestre` : 'Curso'}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
                                <p className="text-xl text-gray-200 max-w-2xl">{course.description}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/course/${course.id}/learn`)}
                                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/10 flex items-center gap-2 whitespace-nowrap"
                            >
                                <ion-icon name="play-circle-outline" class="text-2xl"></ion-icon>
                                Comenzar Curso
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Teacher Bio */}
                        <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <ion-icon name="person-circle-outline" class="text-blue-600"></ion-icon>
                                Tu Instructor
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <img src={intro.teacherInfo.image} alt={intro.teacherInfo.name} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{intro.teacherInfo.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {intro.teacherInfo.bio}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Student Work Gallery */}
                        {intro.studentWork.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <ion-icon name="images-outline" class="text-purple-600"></ion-icon>
                                    Trabajos de Alumnos
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {intro.studentWork.map((work, idx) => (
                                        <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md">
                                            <img src={work.image} alt={work.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <span className="text-white font-medium">{work.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Software Requirements */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ion-icon name="desktop-outline" class="text-blue-500"></ion-icon>
                                Software Recomendado
                            </h3>
                            <ul className="space-y-3">
                                {intro.software.map((sw, idx) => (
                                    <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm text-2xl">
                                            <ion-icon name={sw.icon}></ion-icon>
                                        </div>
                                        <span className="font-medium">{sw.name}</span>
                                    </li>
                                ))}
                                {intro.software.length === 0 && <li className="text-gray-500 italic">No especificado</li>}
                            </ul>
                        </div>

                        {/* Hardware Requirements */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ion-icon name="hardware-chip-outline" class="text-green-500"></ion-icon>
                                Requisitos de PC
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Procesador</span>
                                    <p className="font-medium">{intro.hardware.cpu}</p>
                                </div>
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Memoria RAM</span>
                                    <p className="font-medium">{intro.hardware.ram}</p>
                                </div>
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Tarjeta Gráfica</span>
                                    <p className="font-medium">{intro.hardware.gpu}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseIntroPage;
