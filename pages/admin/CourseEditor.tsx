import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourses } from '../../context/CoursesContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import type { Course, Module, Lesson, Quiz } from '../../types';
import QuizBuilder from './QuizBuilder';

const CourseEditor: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { getCourse, refreshCourses } = useCourses();
    const { user, updateUserProgress } = useAuth();

    const isNew = !courseId || courseId === 'new';

    const [formData, setFormData] = useState<Course>({
        id: Date.now(),
        title: '',
        subtitle: '',
        description: '',
        thumbnail: '',
        modules: []
    });

    const [editingQuizLessonId, setEditingQuizLessonId] = useState<number | null>(null);

    useEffect(() => {
        if (!isNew && courseId) {
            const existingCourse = getCourse(Number(courseId));
            if (existingCourse) {
                setFormData(existingCourse);
            } else {
                navigate('/admin'); // Redirect if course not found
            }
        }
    }, [courseId, isNew, getCourse, navigate]);

    const handleSave = async () => {
        if (!formData.title) return alert('El título es obligatorio');

        try {
            if (isNew) {
                const newCourseData = {
                    ...formData,
                    instructorId: user?.id
                };
                const res = await api.createCourse(newCourseData);
                await refreshCourses();

                if (res.course && res.course.id && user) {
                     updateUserProgress({ assignedCourses: [...(user.assignedCourses || []), res.course.id] });
                }
            } else {
                await api.updateCourse(formData);
                await refreshCourses();
            }
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Error al guardar el curso');
        }
    };

    const addModule = () => {
        const newModule: Module = {
            id: Date.now(),
            title: 'Nuevo Módulo',
            lessons: []
        };
        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, newModule]
        }));
    };

    const updateModule = (moduleId: number, title: string) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? { ...m, title } : m)
        }));
    };

    const deleteModule = (moduleId: number) => {
        if (!confirm('¿Eliminar módulo?')) return;
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== moduleId)
        }));
    };

    const addLesson = (moduleId: number) => {
        const newLesson: Lesson = {
            id: Date.now(),
            title: 'Nueva Lección',
            videoId: '',
            duration: '0:00',
            description: ''
        };

        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: [...m.lessons, newLesson] };
                }
                return m;
            })
        }));
    };

    const updateLesson = (moduleId: number, lessonId: number, field: keyof Lesson, value: string) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(m => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
                    };
                }
                return m;
            })
        }));
    };

    const deleteLesson = (moduleId: number, lessonId: number) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
                }
                return m;
            })
        }));
    };

    const handleSaveQuiz = (moduleId: number, lessonId: number, quiz: Quiz) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map(m => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map(l => l.id === lessonId ? { ...l, quiz } : l)
                    };
                }
                return m;
            })
        }));
        setEditingQuizLessonId(null);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isNew ? 'Crear Nuevo Curso' : 'Editar Curso'}
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium"
                    >
                        Guardar Curso
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Información Básica</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Curso</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej. Introducción a React"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo Corto</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej. Aprende las bases en 30 minutos"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Completa</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Describe de qué trata el curso..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Miniatura (Opcional)</label>
                            <input
                                type="text"
                                value={formData.thumbnail || ''}
                                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </section>

                {/* Modules & Lessons */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Contenido del Curso</h2>
                        <button
                            onClick={addModule}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <ion-icon name="add-outline"></ion-icon>
                            Añadir Módulo
                        </button>
                    </div>

                    {formData.modules.map((module, mIndex) => (
                        <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-4">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                    {mIndex + 1}
                                </div>
                                <input
                                    type="text"
                                    value={module.title}
                                    onChange={e => updateModule(module.id, e.target.value)}
                                    className="flex-1 bg-transparent font-bold text-gray-800 focus:bg-white px-2 py-1 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    onClick={() => deleteModule(module.id)}
                                    className="text-gray-400 hover:text-red-500 p-2"
                                >
                                    <ion-icon name="trash-outline"></ion-icon>
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {module.lessons.map((lesson, lIndex) => (
                                    <div key={lesson.id} className="flex flex-col gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lección {lIndex + 1}</span>
                                            <button
                                                onClick={() => deleteLesson(module.id, lesson.id)}
                                                className="ml-auto text-xs text-red-400 hover:text-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={lesson.title}
                                                onChange={e => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                                placeholder="Título de la lección"
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={lesson.videoId}
                                                onChange={e => updateLesson(module.id, lesson.id, 'videoId', e.target.value)}
                                                placeholder="ID de YouTube (ej. M7lc1UVf-VE)"
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none font-mono"
                                            />
                                            <input
                                                type="text"
                                                value={lesson.duration}
                                                onChange={e => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                                placeholder="Duración (ej. 5:00)"
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={lesson.description}
                                                onChange={e => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                                                placeholder="Descripción breve"
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        {/* Quiz Section */}
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            {editingQuizLessonId === lesson.id ? (
                                                <QuizBuilder
                                                    quiz={lesson.quiz}
                                                    onSave={(quiz) => handleSaveQuiz(module.id, lesson.id, quiz)}
                                                    onCancel={() => setEditingQuizLessonId(null)}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <ion-icon name="help-circle-outline" class="text-purple-500"></ion-icon>
                                                        {lesson.quiz ? (
                                                            <span className="text-green-600 font-medium">Quiz configurado ({lesson.quiz.questions.length} preguntas)</span>
                                                        ) : (
                                                            <span>Sin Quiz</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => setEditingQuizLessonId(lesson.id)}
                                                        className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${lesson.quiz ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                    >
                                                        {lesson.quiz ? 'Editar Quiz' : 'Añadir Quiz'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => addLesson(module.id)}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                                >
                                    <ion-icon name="add-circle-outline" class="w-5 h-5"></ion-icon>
                                    Añadir Lección
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default CourseEditor;
