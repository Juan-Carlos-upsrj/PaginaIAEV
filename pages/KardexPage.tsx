import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { useUser } from '../context/UserContext';

const KardexPage: React.FC = () => {
    const { quarters, gpa, progress } = useAcademic();
    const { user } = useUser();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <header className="sticky top-4 z-50 mx-4 mb-8 rounded-2xl glass shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors">
                                <ion-icon name="arrow-back-outline" class="w-6 h-6"></ion-icon>
                            </a>
                            <h1 className="text-2xl font-bold text-gray-800">Mi Kardex</h1>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20">
                            <ion-icon name="download-outline"></ion-icon>
                            <span className="hidden sm:inline">Descargar Historial</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Academic Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                            <ion-icon name="school"></ion-icon>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Promedio General</p>
                            <h3 className="text-3xl font-bold text-gray-800">{gpa}</h3>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl">
                            <ion-icon name="checkmark-circle"></ion-icon>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-sm font-medium mb-1">Progreso de Carrera</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-3xl font-bold text-gray-800">{progress}%</h3>
                                <span className="text-sm text-gray-500 mb-1">completado</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl">
                            <ion-icon name="calendar"></ion-icon>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Cuatrimestre Actual</p>
                            <h3 className="text-3xl font-bold text-gray-800">2º</h3>
                            <p className="text-xs text-purple-600 font-medium mt-1">En curso</p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                    {quarters.map((quarter, index) => (
                        <div key={quarter.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Icon */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${quarter.status === 'completed' ? 'bg-green-500 text-white' :
                                    quarter.status === 'current' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                <ion-icon name={
                                    quarter.status === 'completed' ? 'checkmark' :
                                        quarter.status === 'current' ? 'play' : 'time'
                                }></ion-icon>
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{quarter.name}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${quarter.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                quarter.status === 'current' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {quarter.status === 'completed' ? 'Completado' :
                                                quarter.status === 'current' ? 'En Curso' : 'Próximamente'}
                                        </span>
                                    </div>
                                    {quarter.average && (
                                        <div className="text-right">
                                            <span className="block text-xs text-gray-500">Promedio</span>
                                            <span className="font-bold text-lg text-gray-800">{quarter.average}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {quarter.subjects.map(subject => (
                                        <div key={subject.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/60">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${subject.status === 'completed' ? 'bg-green-500' :
                                                        subject.status === 'enrolled' ? 'bg-blue-500' : 'bg-gray-300'
                                                    }`}></div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{subject.name}</p>
                                                    <p className="text-xs text-gray-500">{subject.credits} créditos</p>
                                                </div>
                                            </div>
                                            {subject.grade ? (
                                                <span className="font-bold text-gray-800">{subject.grade}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    {subject.status === 'enrolled' ? 'Cursando' : '-'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default KardexPage;
