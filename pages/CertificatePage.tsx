import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';

const CertificatePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const { getCourse } = useCourses();
    const navigate = useNavigate();
    const certificateRef = useRef<HTMLDivElement>(null);

    const course = getCourse(Number(courseId));

    if (!user || !course) {
        return <div className="p-8 text-center">Certificado no disponible.</div>;
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 print:bg-white print:p-0">
            <div className="mb-8 flex gap-4 print:hidden">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                    <ion-icon name="arrow-back"></ion-icon> Volver
                </button>
                <button
                    onClick={handlePrint}
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 font-bold shadow-lg shadow-blue-500/30"
                >
                    <ion-icon name="print"></ion-icon> Imprimir / Guardar PDF
                </button>
            </div>

            <div
                ref={certificateRef}
                className="bg-white text-gray-900 w-[1100px] h-[750px] p-12 relative overflow-hidden shadow-2xl print:shadow-none print:w-full print:h-screen print:absolute print:top-0 print:left-0"
            >
                {/* Border Design */}
                <div className="absolute inset-4 border-4 border-double border-gray-200 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 rounded-br-full"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-600 to-purple-600 opacity-20 rounded-tl-full"></div>

                <div className="h-full flex flex-col items-center justify-center text-center relative z-10">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            IA
                        </div>
                        <h2 className="text-blue-600 font-bold tracking-widest mt-4 uppercase text-sm">IAEV Online Academy</h2>
                    </div>

                    <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Certificado de Finalización</h1>

                    <p className="text-xl text-gray-500 mb-8 italic">Este documento certifica que</p>

                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 border-b-2 border-gray-200 pb-4 px-12 inline-block min-w-[400px]">
                        {user.name}
                    </div>

                    <p className="text-xl text-gray-500 mt-8 mb-4 italic">ha completado satisfactoriamente el curso</p>

                    <h3 className="text-3xl font-bold text-gray-800 mb-12">{course.title}</h3>

                    <div className="flex justify-between items-end w-full max-w-3xl px-12 mt-8">
                        <div className="text-center">
                            <div className="w-48 border-b border-gray-400 mb-2"></div>
                            <p className="font-bold text-gray-900">Director Académico</p>
                            <p className="text-xs text-gray-500">IAEV Online</p>
                        </div>

                        <div className="text-center">
                            <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center border-4 border-yellow-400/50 mb-2 mx-auto">
                                <ion-icon name="ribbon" class="text-5xl text-yellow-500"></ion-icon>
                            </div>
                            <p className="text-sm font-bold text-gray-600">Verificado</p>
                            <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="text-center">
                            <div className="w-48 border-b border-gray-400 mb-2"></div>
                            <p className="font-bold text-gray-900">Instructor del Curso</p>
                            <p className="text-xs text-gray-500">{course.instructor || 'IAEV Academy'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;
