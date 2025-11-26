import React, { createContext, useContext, useEffect } from 'react';
import { dashboardCourses, courseData as initialCourseData } from '../data/courses';
import type { Course, CourseSummary } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useUser } from './UserContext';

interface CourseContextType {
    courses: Course[];
    summaries: CourseSummary[];
    addCourse: (course: Course) => void;
    updateCourse: (course: Course) => void;
    deleteCourse: (courseId: number) => void;
    getCourse: (id: number) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Helper component to handle progress updates
// We put this in a separate component to keep the Provider clean and separation of concerns
const CourseProgressUpdater: React.FC<{
    courses: Course[];
    setSummaries: (value: CourseSummary[] | ((val: CourseSummary[]) => CourseSummary[])) => void;
}> = ({ courses, setSummaries }) => {
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        setSummaries(prevSummaries => {
            let hasChanges = false;
            const newSummaries = prevSummaries.map(summary => {
                const course = courses.find(c => c.id === summary.id);
                if (!course) return summary;

                const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                if (totalLessons === 0) return summary;

                const completedInCourse = course.modules
                    .flatMap(m => m.lessons)
                    .filter(l => user.completedLessons.includes(l.id))
                    .length;

                const newProgress = Math.round((completedInCourse / totalLessons) * 100);
                const newStatus = newProgress === 100 ? 'completed' : newProgress > 0 ? 'active' : 'new';

                if (summary.progress !== newProgress || summary.status !== newStatus) {
                    hasChanges = true;
                    return { ...summary, progress: newProgress, status: newStatus };
                }
                return summary;
            });

            return hasChanges ? newSummaries : prevSummaries;
        });
    }, [user?.completedLessons, courses, setSummaries]);

    return null;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useLocalStorage<Course[]>('iaev_courses', initialCourseData);
    const [summaries, setSummaries] = useLocalStorage<CourseSummary[]>('iaev_summaries', dashboardCourses || []);

    // Merge new static data if needed
    useEffect(() => {
        const existingIds = new Set(courses.map(c => c.id));
        const newCourses = initialCourseData.filter(c => !existingIds.has(c.id));

        const safeDashboardCourses = dashboardCourses || [];
        const newSummaries = safeDashboardCourses.filter(s => !existingIds.has(s.id));

        if (newCourses.length > 0) {
            setCourses(prev => [...prev, ...newCourses]);
            setSummaries(prev => [...prev, ...newSummaries]);
        }
    }, []); // Run once on mount

    const addCourse = (newCourse: Course) => {
        const newSummary: CourseSummary = {
            id: newCourse.id,
            title: newCourse.title,
            subtitle: newCourse.description.substring(0, 100) + '...', // Simple summary generation
            progress: 0,
            status: 'new',
            thumbnail: newCourse.thumbnail
        };

        setCourses(prev => [...prev, newCourse]);
        setSummaries(prev => [...prev, newSummary]);
    };

    const updateCourse = (updatedCourse: Course) => {
        setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));

        // Also update summary if title/desc changed
        setSummaries(prev => prev.map(s => {
            if (s.id === updatedCourse.id) {
                return {
                    ...s,
                    title: updatedCourse.title,
                    subtitle: updatedCourse.description.substring(0, 100) + '...',
                    thumbnail: updatedCourse.thumbnail
                };
            }
            return s;
        }));
    };

    const deleteCourse = (courseId: number) => {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        setSummaries(prev => prev.filter(s => s.id !== courseId));
    };

    const getCourse = (id: number) => courses.find(c => c.id === id);

    return (
        <CourseContext.Provider value={{ courses, summaries, addCourse, updateCourse, deleteCourse, getCourse }}>
            <CourseProgressUpdater courses={courses} setSummaries={setSummaries} />
            {children}
        </CourseContext.Provider>
    );
};

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error('useCourses must be used within a CourseProvider');
    }
    return context;
};
