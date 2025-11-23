import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardCourses, courseData as initialCourseData } from '../data/courses';
import type { Course, CourseSummary } from '../types';

interface CourseContextType {
    courses: Course[];
    summaries: CourseSummary[];
    addCourse: (course: Course) => void;
    updateCourse: (course: Course) => void;
    deleteCourse: (courseId: number) => void;
    getCourse: (id: number) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [summaries, setSummaries] = useState<CourseSummary[]>([]);

    // Load initial data from localStorage or fall back to static data
    useEffect(() => {
        try {
            const savedCourses = localStorage.getItem('iaev_courses');
            const savedSummaries = localStorage.getItem('iaev_summaries');

            if (savedCourses && savedSummaries) {
                const parsedCourses = JSON.parse(savedCourses);
                const parsedSummaries = JSON.parse(savedSummaries);

                // Merge: Add any new courses from static data that aren't in localStorage
                const existingIds = new Set(parsedCourses.map((c: Course) => c.id));
                const newCourses = initialCourseData.filter(c => !existingIds.has(c.id));

                // Safeguard: Ensure dashboardCourses is defined before filtering
                const safeDashboardCourses = dashboardCourses || [];
                const newSummaries = safeDashboardCourses.filter(s => !existingIds.has(s.id));

                if (newCourses.length > 0) {
                    const mergedCourses = [...parsedCourses, ...newCourses];
                    const mergedSummaries = [...parsedSummaries, ...newSummaries];
                    setCourses(mergedCourses);
                    setSummaries(mergedSummaries);
                    localStorage.setItem('iaev_courses', JSON.stringify(mergedCourses));
                    localStorage.setItem('iaev_summaries', JSON.stringify(mergedSummaries));
                } else {
                    setCourses(parsedCourses);
                    setSummaries(parsedSummaries);
                }
            } else {
                // Initialize with static data
                setCourses(initialCourseData);
                // Safeguard: Ensure dashboardCourses is defined
                setSummaries(dashboardCourses || []);
                // Save immediately to persist for future
                localStorage.setItem('iaev_courses', JSON.stringify(initialCourseData));
                localStorage.setItem('iaev_summaries', JSON.stringify(dashboardCourses || []));
            }
        } catch (error) {
            console.error("Error loading course data:", error);
            // Fallback to initial data in case of error
            setCourses(initialCourseData);
            setSummaries(dashboardCourses || []);
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (courses.length > 0) {
            localStorage.setItem('iaev_courses', JSON.stringify(courses));
        }
    }, [courses]);

    useEffect(() => {
        if (summaries.length > 0) {
            localStorage.setItem('iaev_summaries', JSON.stringify(summaries));
        }
    }, [summaries]);

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
