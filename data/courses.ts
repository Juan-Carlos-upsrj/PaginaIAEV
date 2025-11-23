import type { Course, CourseSummary } from '../types';

export const courseData: Course[] = [
    {
        id: 1,
        title: "Diseño Web Moderno",
        subtitle: "De Cero a Héroe con HTML y CSS",
        description: "Aprende a crear sitios web modernos y responsivos desde cero utilizando las últimas tecnologías web.",
        instructor: "Prof. María González",
        modules: [
            {
                id: 1,
                title: "Módulo 1: Introducción",
                lessons: [
                    { id: 101, title: "Bienvenida y Visión General", videoId: "M7lc1UVf-VE", duration: "3:15", description: "En esta lección, daremos un vistazo general a los objetivos del curso y las herramientas que utilizaremos." },
                    { id: 102, title: "Herramientas Esenciales", videoId: "z0nJcE1fnBE", duration: "5:40", description: "Configuraremos nuestro entorno de desarrollo, incluyendo el editor de código y el navegador." },
                ]
            },
            {
                id: 2,
                title: "Módulo 2: HTML Básico",
                lessons: [
                    { id: 201, title: "Estructura de un Documento", videoId: "O-b5-KJMbi8", duration: "8:20", description: "Aprende las etiquetas fundamentales de HTML como <html>, <head>, y <body>." },
                    { id: 202, title: "Etiquetas de Texto", videoId: "3009j0sVjrk", duration: "10:05", description: "Explora cómo formatear texto con encabezados, párrafos, negritas y más." },
                ]
            },
            {
                id: 3,
                title: "Módulo 3: CSS Básico",
                lessons: [
                    { id: 301, title: "Introducción a CSS", videoId: "W6NZfCO5ni8", duration: "12:50", description: "Descubre qué es CSS y cómo cambia la apariencia de tu sitio web." },
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Introducción a Houdini",
        subtitle: "Simulaciones y Efectos Visuales",
        description: "Aprende a crear simulaciones impresionantes en Houdini, desde conceptos básicos hasta efectos avanzados.",
        instructor: "Prof. Carlos Mendoza",
        thumbnail: "https://source.unsplash.com/800x600/?3d,visual-effects",
        modules: [
            {
                id: 1,
                title: "Módulo 1: Simulaciones Básicas",
                lessons: [
                    {
                        id: 101,
                        title: "Raíces que jalan",
                        videoId: "jrYFzQsHw7o",
                        duration: "15:00",
                        description: "Aprende a crear una simulación realista de raíces que crecen y se mueven de forma orgánica en Houdini."
                    }
                ]
            }
        ]
    }
];

export const dashboardCourses: CourseSummary[] = [
    { id: 1, title: 'Diseño Web Moderno', subtitle: 'De Cero a Héroe con HTML y CSS', progress: 0, status: 'new', image: 'https://source.unsplash.com/800x600/?web,design', duration: '12 horas', description: 'Aprende HTML y CSS desde cero' },
    { id: 2, title: 'Introducción a Houdini', subtitle: 'Simulaciones y Efectos Visuales', progress: 0, status: 'new', thumbnail: 'https://source.unsplash.com/800x600/?3d,visual-effects', image: 'https://source.unsplash.com/800x600/?3d,visual-effects', duration: '10 horas', description: 'Simulaciones 3D impresionantes' },
];