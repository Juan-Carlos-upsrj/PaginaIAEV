# Especificaciones de la Plataforma Educativa IAEV

Este documento detalla la arquitectura, funcionalidades y características técnicas implementadas en la plataforma educativa **IAEV Online**.

## 1. Arquitectura Técnica

*   **Frontend**: React 18 (Vite) con TypeScript.
*   **Backend**: PHP (API RESTful).
*   **Estilos**: Tailwind CSS para diseño responsivo y moderno (Glassmorphism).
*   **Estado**: Context API (`AuthContext`, `CoursesContext`, `AcademicContext`, `BookmarkContext`) para gestión global.
*   **Comunicación**: Cliente API centralizado (`utils/api.ts`) con manejo de sesiones, credenciales y detección de entorno (Local vs Producción).
*   **Ruteo**: React Router v6 con protección de rutas basada en roles (`ProtectedRoute`).

## 2. Módulo de Autenticación y Usuarios

*   **Roles de Usuario**:
    *   **Estudiante**: Acceso a cursos, progreso, kardex.
    *   **Docente/Admin**: Gestión de contenidos y usuarios.
*   **Funcionalidades**:
    *   **Login**: Autenticación segura contra backend PHP.
    *   **Registro**: Flujo de registro para alumnos (con validación de correo institucional).
    *   **Sesión**: Persistencia de sesión mediante cookies y verificación automática al inicio.
    *   **Perfil**: Edición de datos personales, biografía, redes sociales y avatar.

## 3. Portal del Estudiante

### 3.1. Dashboard
*   Vista general del progreso.
*   Resumen de cursos activos y recomendados.
*   Estadísticas personales (XP, Nivel).

### 3.2. Cursos y Aprendizaje
*   **Catálogo**: Listado de cursos filtrable por categorías.
*   **Reproductor**: Visualización de lecciones (Video YouTube/Vimeo).
*   **Progreso**: Marcado automático de lecciones vistas.
*   **Quizzes**: Evaluaciones interactivas al final de las lecciones con puntaje.
*   **Marcadores**: Posibilidad de guardar lecciones favoritas.

### 3.3. Herramientas Académicas
*   **Kardex**: Visualización de historial académico, calificaciones y avance de carrera por cuatrimestre.
*   **Calendario**: Agenda de entregas, exámenes y clases en vivo.
*   **Comunidad**: Foro de discusión por curso o general (Posts, Likes, Comentarios).
*   **Certificados**: Generación de certificado al completar un curso (vista previa e impresión).

## 4. Panel de Administración (Docentes)

### 4.1. Gestión de Usuarios
*   **Estudiantes**:
    *   Listado completo con filtros por grupo.
    *   **Activación**: Toggle para activar/desactivar acceso de alumnos.
    *   **Importación Masiva**: Carga de lista de correos permitidos (CSV/Texto) para pre-autorizar registros.
    *   Gestión de Grupos.
*   **Docentes**:
    *   Registro manual de nuevos profesores.
    *   Asignación de materias a docentes.

### 4.2. Gestión de Contenidos (Course Editor)
*   **Creación/Edición**: Interfaz completa para crear cursos desde cero.
*   **Estructura**: Organización por Módulos y Lecciones.
*   **Contenido**: Edición de título, descripción, video y duración.
*   **Evaluaciones**: Constructor de Quizzes integrado en cada lección.

### 4.3. Analíticas
*   **Dashboard**: Métricas globales (Total alumnos, cursos activos).
*   **Reportes**: Filtrado por grupo y cuatrimestre.
*   **Tiempo Real**: Conteo de alumnos activos basado en el estado actual.

## 5. Diseño y UX

*   **Tema**: Soporte para Modo Oscuro/Claro.
*   **Interfaz**: Diseño limpio tipo "Glass" con animaciones suaves.
*   **Feedback**: Notificaciones (Toast/Confetti) para logros y acciones.
*   **Responsividad**: Adaptado para móviles, tablets y escritorio.
