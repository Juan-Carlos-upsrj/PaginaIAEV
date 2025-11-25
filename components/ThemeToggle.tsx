import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('iaev_theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('iaev_theme', newTheme);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
            {theme === 'light' ? (
                <ion-icon name="moon-outline" class="w-6 h-6"></ion-icon>
            ) : (
                <ion-icon name="sunny-outline" class="w-6 h-6 text-yellow-400"></ion-icon>
            )}
        </button>
    );
};

export default ThemeToggle;
