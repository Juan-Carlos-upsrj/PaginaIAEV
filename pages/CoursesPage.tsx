import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';

const CoursesPage: React.FC = () => {
    const navigate = useNavigate();
    const { summaries } = useCourses();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const categories = ['Todos', 'Programación', 'Diseño', '3D', 'Data Science'];

    const filteredCourses = (summaries || []).filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
        // Mock category filtering since we don't have categories in the data yet
        // In a real app, we would filter by course.category
        const matchesCategory = selectedCategory === 'Todos' || true;

        return matchesSearch && matchesCategory;
    });

    const handleSelectCourse = (id: number) => {
        navigate(`/course/${id}`);
    };

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <header className="sticky top-4 z-50 mx-4 mb-8 rounded-2xl glass shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors">
                                <ion-icon name="arrow-back-outline" class="w-6 h-6"></ion-icon>
                            </a>
                            <h1 className="text-2xl font-bold text-gray-800">Catálogo de Cursos</h1>
                        </div>

                        <div className="relative hidden md:block">
                            <ion-icon name="search-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
                            <input
                                type="text"
                                placeholder="Buscar cursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm w-64"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-6 mb-6 custom-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-white/50 text-gray-600 hover:bg-white hover:text-blue-600'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mb-8 relative">
                    <ion-icon name="search-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
                    <input
                        type="text"
                        placeholder="Buscar cursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} onSelectCourse={handleSelectCourse} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass rounded-2xl">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <ion-icon name="search-outline" class="w-8 h-8"></ion-icon>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">No se encontraron cursos</h3>
                        <p className="text-gray-500 mt-1">Intenta con otros términos de búsqueda.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CoursesPage;
