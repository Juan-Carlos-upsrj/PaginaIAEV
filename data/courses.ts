import type { Course, CourseSummary } from '../types';

const mockIntro = {
    teacherInfo: {
        name: "Dr. Alan Turing",
        bio: "Experto en inteligencia artificial y ciencias de la computación con más de 15 años de experiencia en la industria y la academia.",
        image: "https://ui-avatars.com/api/?name=Alan+Turing&background=random"
    },
    studentWork: [
        { title: "Proyecto Final 2023", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500" },
        { title: "Demo Reel", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=500" }
    ],
    software: [
        { name: "VS Code", icon: "code-slash-outline" },
        { name: "Unity", icon: "cube-outline" }
    ],
    hardware: {
        cpu: "Intel Core i7 o superior",
        ram: "16GB RAM",
        gpu: "NVIDIA RTX 3060 o superior"
    }
};

export const courseData: Course[] = [
    // Cuatrimestre Propedéutico (0)
    {
        id: 1,
        title: "Introducción a la Lengua Inglesa",
        subtitle: "Cuatrimestre Propedéutico - 300 Horas",
        description: "Curso introductorio para el desarrollo de habilidades básicas en el idioma inglés.",
        thumbnail: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 0,
        intro: mockIntro,
        modules: []
    },
    {
        id: 2,
        title: "Desarrollo de Competencias Globales",
        subtitle: "Cuatrimestre Propedéutico - 90 Horas",
        description: "Desarrollo de habilidades blandas y competencias transversales para el entorno global.",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 0,
        intro: mockIntro,
        modules: []
    },
    {
        id: 3,
        title: "Desarrollo Sostenible",
        subtitle: "Cuatrimestre Propedéutico - 90 Horas",
        description: "Introducción a los principios de sostenibilidad y responsabilidad social.",
        thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 0,
        intro: mockIntro,
        modules: []
    },
    {
        id: 4,
        title: "Tutorías BIS",
        subtitle: "Cuatrimestre Propedéutico - 45 Horas",
        description: "Acompañamiento tutorial para la integración al modelo BIS.",
        thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 0,
        intro: mockIntro,
        modules: []
    },

    // Primer Cuatrimestre (1)
    {
        id: 101,
        title: "Inglés I",
        subtitle: "1er Cuatrimestre - 225 Horas",
        description: "Curso de inglés nivel básico I.",
        thumbnail: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },
    {
        id: 102,
        title: "Desarrollo Humano y Valores",
        subtitle: "1er Cuatrimestre - 60 Horas",
        description: "Formación en valores y crecimiento personal.",
        thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },
    {
        id: 103,
        title: "Fundamentos Matemáticos",
        subtitle: "1er Cuatrimestre - 105 Horas",
        description: "Bases matemáticas para ingeniería y animación.",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },
    {
        id: 104,
        title: "Dibujo y Técnicas de Representación",
        subtitle: "1er Cuatrimestre - 75 Horas",
        description: "Fundamentos del dibujo artístico y técnico.",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },
    {
        id: 105,
        title: "Historia del Arte",
        subtitle: "1er Cuatrimestre - 60 Horas",
        description: "Recorrido por las principales corrientes artísticas y su influencia.",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },
    {
        id: 106,
        title: "Narrativa y Guionismo",
        subtitle: "1er Cuatrimestre - 75 Horas",
        description: "Técnicas de storytelling y escritura de guiones.",
        thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },
    {
        id: 107,
        title: "Comunicación y Habilidades Digitales",
        subtitle: "1er Cuatrimestre - 75 Horas",
        description: "Herramientas digitales y comunicación efectiva.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 1,
        intro: mockIntro,
        modules: []
    },

    // Segundo Cuatrimestre (2)
    {
        id: 201,
        title: "Inglés II",
        subtitle: "2do Cuatrimestre - 150 Horas",
        description: "Curso de inglés nivel básico II.",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },
    {
        id: 202,
        title: "Habilidades Socioemocionales y Manejo de Conflictos",
        subtitle: "2do Cuatrimestre - 60 Horas",
        description: "Desarrollo de inteligencia emocional y resolución de problemas.",
        thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },
    {
        id: 203,
        title: "Cálculo Diferencial",
        subtitle: "2do Cuatrimestre - 90 Horas",
        description: "Estudio de límites, derivadas y sus aplicaciones.",
        thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },
    {
        id: 204,
        title: "Física",
        subtitle: "2do Cuatrimestre - 90 Horas",
        description: "Principios físicos aplicados a la animación y simulación.",
        thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },
    {
        id: 205,
        title: "Dibujo Digital y Teoría del Color",
        subtitle: "2do Cuatrimestre - 75 Horas",
        description: "Técnicas de ilustración digital y psicología del color.",
        thumbnail: "https://images.unsplash.com/photo-1626785774573-4b79931256ce?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },
    {
        id: 206,
        title: "Anatomía Humana y Animal",
        subtitle: "2do Cuatrimestre - 75 Horas",
        description: "Estudio de la estructura y movimiento de seres vivos.",
        thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },
    {
        id: 207,
        title: "Storyboard",
        subtitle: "2do Cuatrimestre - 60 Horas",
        description: "Creación de guiones gráficos para previsualización.",
        thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 2,
        intro: mockIntro,
        modules: []
    },

    // Tercer Cuatrimestre (3)
    {
        id: 301,
        title: "Inglés III",
        subtitle: "3er Cuatrimestre - 150 Horas",
        description: "Curso de inglés nivel intermedio I.",
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },
    {
        id: 302,
        title: "Desarrollo del Pensamiento y Toma de Decisiones",
        subtitle: "3er Cuatrimestre - 60 Horas",
        description: "Habilidades cognitivas para la solución de problemas.",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },
    {
        id: 303,
        title: "Cálculo Integral",
        subtitle: "3er Cuatrimestre - 60 Horas",
        description: "Integrales y sus aplicaciones en ingeniería.",
        thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },
    {
        id: 304,
        title: "Semiótica y Creación de Personajes",
        subtitle: "3er Cuatrimestre - 90 Horas",
        description: "Diseño conceptual y simbología de personajes.",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },
    {
        id: 305,
        title: "Fundamentos de la Animación",
        subtitle: "3er Cuatrimestre - 90 Horas",
        description: "Los 12 principios de la animación.",
        thumbnail: "https://images.unsplash.com/photo-1626544827763-d516dce335ca?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },
    {
        id: 306,
        title: "Taller de Escultura y Maquetas",
        subtitle: "3er Cuatrimestre - 90 Horas",
        description: "Modelado tradicional y creación de props físicos.",
        thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },
    {
        id: 307,
        title: "Proyecto Integrador I",
        subtitle: "3er Cuatrimestre - 60 Horas",
        description: "Desarrollo de un proyecto multidisciplinario inicial.",
        thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 3,
        intro: mockIntro,
        modules: []
    },

    // Cuarto Cuatrimestre (4)
    {
        id: 401,
        title: "Inglés IV",
        subtitle: "4to Cuatrimestre - 120 Horas",
        description: "Curso de inglés nivel intermedio II.",
        thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },
    {
        id: 402,
        title: "Ética Profesional",
        subtitle: "4to Cuatrimestre - 60 Horas",
        description: "Deontología y ética en el ejercicio profesional.",
        thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },
    {
        id: 403,
        title: "Cálculo de Varias Variables",
        subtitle: "4to Cuatrimestre - 75 Horas",
        description: "Cálculo vectorial y multivariable.",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },
    {
        id: 404,
        title: "Probabilidad y Estadística",
        subtitle: "4to Cuatrimestre - 75 Horas",
        description: "Análisis de datos y modelos probabilísticos.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },
    {
        id: 405,
        title: "Animación 2D",
        subtitle: "4to Cuatrimestre - 75 Horas",
        description: "Técnicas de animación digital bidimensional.",
        thumbnail: "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },
    {
        id: 406,
        title: "Introducción al Modelado 3D",
        subtitle: "4to Cuatrimestre - 90 Horas",
        description: "Fundamentos de modelado poligonal y orgánico.",
        thumbnail: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },
    {
        id: 407,
        title: "Dirección Fotográfica",
        subtitle: "4to Cuatrimestre - 75 Horas",
        description: "Iluminación, composición y lenguaje visual.",
        thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 4,
        intro: mockIntro,
        modules: []
    },

    // Quinto Cuatrimestre (5)
    {
        id: 501,
        title: "Inglés V",
        subtitle: "5to Cuatrimestre - 120 Horas",
        description: "Curso de inglés nivel avanzado I.",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },
    {
        id: 502,
        title: "Liderazgo de Equipos de Alto Desempeño",
        subtitle: "5to Cuatrimestre - 60 Horas",
        description: "Gestión y dirección de equipos creativos.",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },
    {
        id: 503,
        title: "Ecuaciones Diferenciales",
        subtitle: "5to Cuatrimestre - 75 Horas",
        description: "Modelado matemático de fenómenos físicos.",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },
    {
        id: 504,
        title: "Grabación y Diseño de Audio",
        subtitle: "5to Cuatrimestre - 90 Horas",
        description: "Producción y postproducción de sonido.",
        thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },
    {
        id: 505,
        title: "Técnicas de Cine",
        subtitle: "5to Cuatrimestre - 75 Horas",
        description: "Lenguaje cinematográfico y realización.",
        thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },
    {
        id: 506,
        title: "Escultura Digital de Personajes",
        subtitle: "5to Cuatrimestre - 90 Horas",
        description: "Modelado orgánico avanzado con ZBrush/Mudbox.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },
    {
        id: 507,
        title: "Proyecto Integrador II",
        subtitle: "5to Cuatrimestre - 60 Horas",
        description: "Desarrollo de proyecto intermedio.",
        thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 5,
        intro: mockIntro,
        modules: []
    },

    // Sexto Cuatrimestre (6)
    {
        id: 601,
        title: "Estadía Técnico Superior Universitario",
        subtitle: "6to Cuatrimestre - 600 Horas",
        description: "Prácticas profesionales en el sector productivo.",
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 6,
        intro: mockIntro,
        modules: []
    },

    // Séptimo Cuatrimestre (7)
    {
        id: 701,
        title: "Inglés VI",
        subtitle: "7mo Cuatrimestre - 105 Horas",
        description: "Curso de inglés nivel avanzado II.",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },
    {
        id: 702,
        title: "Habilidades Gerenciales",
        subtitle: "7mo Cuatrimestre - 60 Horas",
        description: "Administración y gestión de proyectos.",
        thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },
    {
        id: 703,
        title: "Fundamentos y Producción de Efectos Visuales",
        subtitle: "7mo Cuatrimestre - 75 Horas",
        description: "Introducción al pipeline de VFX.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },
    {
        id: 704,
        title: "Introducción a la Animación 3D",
        subtitle: "7mo Cuatrimestre - 75 Horas",
        description: "Principios de animación aplicados al entorno 3D.",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },
    {
        id: 705,
        title: "Rigging",
        subtitle: "7mo Cuatrimestre - 75 Horas",
        description: "Creación de esqueletos y controles para personajes.",
        thumbnail: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },
    {
        id: 706,
        title: "Texturizado e Iluminación 3D",
        subtitle: "7mo Cuatrimestre - 75 Horas",
        description: "Creación de materiales y setup de luces.",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },
    {
        id: 707,
        title: "Cinematografía",
        subtitle: "7mo Cuatrimestre - 90 Horas",
        description: "Arte y técnica de la cinematografía digital.",
        thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 7,
        intro: mockIntro,
        modules: []
    },

    // Octavo Cuatrimestre (8)
    {
        id: 801,
        title: "Inglés VII",
        subtitle: "8vo Cuatrimestre - 105 Horas",
        description: "Inglés técnico y profesional I.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },
    {
        id: 802,
        title: "Dinámicos y Fluidos",
        subtitle: "8vo Cuatrimestre - 75 Horas",
        description: "Simulación de partículas, fluidos y cuerpos rígidos.",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },
    {
        id: 803,
        title: "Rendering",
        subtitle: "8vo Cuatrimestre - 75 Horas",
        description: "Motores de renderizado y optimización.",
        thumbnail: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },
    {
        id: 804,
        title: "Animación de Personajes en 3D",
        subtitle: "8vo Cuatrimestre - 75 Horas",
        description: "Actuación y mecánica corporal avanzada.",
        thumbnail: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },
    {
        id: 805,
        title: "Rigging Facial",
        subtitle: "8vo Cuatrimestre - 75 Horas",
        description: "Sistemas de control para expresiones faciales.",
        thumbnail: "https://images.unsplash.com/photo-1596496050844-961d5a7920a7?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },
    {
        id: 806,
        title: "Composición de Efectos",
        subtitle: "8vo Cuatrimestre - 75 Horas",
        description: "Compositing y postproducción avanzada.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },
    {
        id: 807,
        title: "Motion Graphics",
        subtitle: "8vo Cuatrimestre - 75 Horas",
        description: "Gráficos en movimiento para broadcast y publicidad.",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 8,
        intro: mockIntro,
        modules: []
    },

    // Noveno Cuatrimestre (9)
    {
        id: 901,
        title: "Inglés VIII",
        subtitle: "9no Cuatrimestre - 105 Horas",
        description: "Inglés técnico y profesional II.",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },
    {
        id: 902,
        title: "Dinámicos de Tela y Cabello",
        subtitle: "9no Cuatrimestre - 90 Horas",
        description: "Simulación avanzada de tejidos y pelo.",
        thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f136d9bc?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },
    {
        id: 903,
        title: "Postproducción Digital",
        subtitle: "9no Cuatrimestre - 75 Horas",
        description: "Finalización y entrega de productos audiovisuales.",
        thumbnail: "https://images.unsplash.com/photo-1535016120720-40c6874c3b13?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },
    {
        id: 904,
        title: "Animación 3D Avanzada",
        subtitle: "9no Cuatrimestre - 75 Horas",
        description: "Técnicas avanzadas de actuación y pulido.",
        thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },
    {
        id: 905,
        title: "Motores Gráficos",
        subtitle: "9no Cuatrimestre - 90 Horas",
        description: "Implementación en Unreal Engine / Unity.",
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },
    {
        id: 906,
        title: "Propiedad Intelectual",
        subtitle: "9no Cuatrimestre - 60 Horas",
        description: "Derechos de autor y registro de obra.",
        thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },
    {
        id: 907,
        title: "Proyecto Integrador III",
        subtitle: "9no Cuatrimestre - 60 Horas",
        description: "Desarrollo de proyecto final de carrera.",
        thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 9,
        intro: mockIntro,
        modules: []
    },

    // Décimo Cuatrimestre (10)
    {
        id: 1001,
        title: "Estadía Licenciatura",
        subtitle: "10mo Cuatrimestre - 600 Horas",
        description: "Prácticas profesionales finales.",
        thumbnail: "https://images.unsplash.com/photo-1521737733038-ef42bd6c5bbe?auto=format&fit=crop&q=80&w=1000",
        cuatrimestre: 10,
        intro: mockIntro,
        modules: []
    }
];

// Generate summaries from the main course data
export const dashboardCourses: CourseSummary[] = courseData.map(course => ({
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    progress: 0,
    status: 'new',
    thumbnail: course.thumbnail,
    // Adding description and image for backward compatibility if needed, though we should migrate to subtitle/thumbnail
    description: course.description,
    image: course.thumbnail
} as any)); // Cast to any to allow extra properties if types aren't fully updated yet