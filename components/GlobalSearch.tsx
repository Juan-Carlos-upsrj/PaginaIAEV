import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { summaries: dashboardCourses } = useCourses();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    const filteredCourses = (dashboardCourses || []).filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };

    const handleSelectCourse = (courseId: number) => {
        navigate(`/course/${courseId}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ion-icon name="search-outline" class="text-gray-400"></ion-icon>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all w-64 focus:w-80"
                    placeholder="Buscar cursos..."
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && query.length > 0 && (
                <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto z-50 custom-scrollbar">
                    {filteredCourses.length > 0 ? (
                        <ul>
                            {filteredCourses.map((course) => (
                                <li key={course.id}>
                                    <button
                                        onClick={() => handleSelectCourse(course.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                                    >
                                        <img src={course.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-48">{course.description}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
