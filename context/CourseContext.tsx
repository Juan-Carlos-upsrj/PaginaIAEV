import React, { createContext, useContext, useEffect } from 'react';
import type { Course, CourseSummary } from '../types';
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
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [summaries, setSummaries] = React.useState<CourseSummary[]>([]);
    const API_URL = import.meta.env.BASE_URL + 'api';

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_URL}/courses.php?action=get_courses`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setCourses(data.courses);
                // Generate summaries from fetched courses
                const newSummaries: CourseSummary[] = data.courses.map((c: Course) => ({
                    id: c.id,
                    title: c.title,
                    subtitle: c.subtitle || '',
                    progress: 0, // Calculated by CourseProgressUpdater
                    status: c.status === 'active' ? 'new' : 'archived',
                    thumbnail: c.thumbnail
                }));
                setSummaries(newSummaries);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const addCourse = async (newCourse: Course) => {
        try {
            const res = await fetch(`${API_URL}/courses.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create_course', ...newCourse })
            });
            const data = await res.json();
            if (data.success) {
                fetchCourses();
            }
        } catch (error) {
            console.error("Failed to add course", error);
        }
    };

    const updateCourse = async (updatedCourse: Course) => {
        try {
            const res = await fetch(`${API_URL}/courses.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_course', ...updatedCourse })
            });
            const data = await res.json();
            if (data.success) {
                fetchCourses();
            }
        } catch (error) {
            console.error("Failed to update course", error);
        }
    };

    const deleteCourse = async (courseId: number) => {
        try {
            const res = await fetch(`${API_URL}/courses.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_course', id: courseId })
            });
            const data = await res.json();
            if (data.success) {
                fetchCourses();
            }
        } catch (error) {
            console.error("Failed to delete course", error);
        }
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
