import React from 'react';
import type { Module, Lesson } from '../types';

interface SidebarProps {
  courseTitle: string;
  modules: Module[];
  activeLessonId: number;
  completedLessons: Set<number>;
  onSelectLesson: (lessonId: number) => void;
}

const Logo: React.FC = () => (
    <span className="text-3xl font-extrabold flex">
        <span className="text-iaev-blue">I</span>
        <span className="text-iaev-yellow">A</span>
        <span className="text-iaev-green">E</span>
        <span className="text-iaev-red">V</span>
        <span className="text-gray-800 ml-1">SITE</span>
    </span>
);

const Sidebar: React.FC<SidebarProps> = ({ courseTitle, modules, activeLessonId, completedLessons, onSelectLesson }) => {
    const allLessonsFlat = modules.flatMap(m => m.lessons);

    const isLessonUnlocked = (lessonId: number) => {
        const lessonIndex = allLessonsFlat.findIndex(l => l.id === lessonId);
        if (lessonIndex === -1) return false;
        if (lessonIndex === 0) return true;
        const prevLessonId = allLessonsFlat[lessonIndex - 1].id;
        return completedLessons.has(prevLessonId);
    };

    return (
        <nav className="w-full md:w-1/4 lg:w-1/5 bg-white shadow-lg overflow-y-auto h-screen border-r border-gray-100 flex-shrink-0">
            <div className="p-5 border-b sticky top-0 bg-white z-10 flex items-center space-x-2">
                <Logo />
            </div>
            <div className="p-5 border-b bg-gray-50">
                <p className="text-sm text-gray-500 font-semibold mb-2">CURSO</p>
                <h2 className="text-xl font-bold text-gray-800">{courseTitle}</h2>
                <p className="text-sm text-gray-500 mt-2">Progreso del Curso</p>
            </div>
            <div className="p-3 space-y-2">
                {modules.map((module) => (
                    <div key={module.id}>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mt-4 mb-2 px-2">{module.title}</h3>
                        {module.lessons.map((lesson) => {
                            const isCompleted = completedLessons.has(lesson.id);
                            const unlocked = isLessonUnlocked(lesson.id);
                            const isActive = lesson.id === activeLessonId;

                            let icon;
                            if (isCompleted) {
                                icon = <ion-icon name="checkmark-circle" class="text-iaev-green w-5 h-5"></ion-icon>;
                            } else if (unlocked) {
                                icon = <ion-icon name="play-circle-outline" class="text-iaev-blue w-5 h-5"></ion-icon>;
                            } else {
                                icon = <ion-icon name="lock-closed" class="text-gray-400 w-5 h-5"></ion-icon>;
                            }
                            
                            const baseClasses = "sidebar-item flex items-center space-x-3 p-3 rounded-lg cursor-pointer text-gray-700";
                            const stateClasses = isActive ? 'active' : !unlocked ? 'locked' : 'hover:bg-gray-100';

                            return (
                                <div
                                    key={lesson.id}
                                    className={`${baseClasses} ${stateClasses}`}
                                    title={!unlocked ? "Completa la lección anterior para desbloquear esta." : ""}
                                    onClick={() => unlocked && onSelectLesson(lesson.id)}
                                >
                                    {icon}
                                    <span className="flex-1 text-sm">{lesson.title}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;