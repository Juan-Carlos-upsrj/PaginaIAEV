import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

interface Bookmark {
    courseId: number;
    lessonId: number;
    courseTitle: string;
    lessonTitle: string;
    timestamp: number;
}

interface BookmarkContextType {
    bookmarks: Bookmark[];
    addBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
    removeBookmark: (lessonId: number) => void;
    isBookmarked: (lessonId: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const API_URL = import.meta.env.BASE_URL + 'api';

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        } else {
            setBookmarks([]);
        }
    }, [user]);

    const fetchBookmarks = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_URL}/student.php?action=get_bookmarks&user_id=${user.id}`);
            const data = await res.json();
            if (data.success) {
                setBookmarks(data.bookmarks);
            }
        } catch (error) {
            console.error("Failed to fetch bookmarks", error);
        }
    };

    const addBookmark = async (bookmark: Omit<Bookmark, 'timestamp'>) => {
        if (!user) return;

        // Optimistic update
        const newBookmark = { ...bookmark, timestamp: Date.now() };
        setBookmarks(prev => [...prev, newBookmark]);

        try {
            await fetch(`${API_URL}/student.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_bookmark',
                    user_id: user.id,
                    ...bookmark
                })
            });
        } catch (error) {
            console.error("Failed to save bookmark", error);
            fetchBookmarks(); // Revert on error
        }
    };

    const removeBookmark = async (lessonId: number) => {
        if (!user) return;

        // Optimistic update
        setBookmarks(prev => prev.filter(b => b.lessonId !== lessonId));

        try {
            await fetch(`${API_URL}/student.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'remove_bookmark',
                    user_id: user.id,
                    lesson_id: lessonId
                })
            });
        } catch (error) {
            console.error("Failed to remove bookmark", error);
            fetchBookmarks(); // Revert on error
        }
    };

    const isBookmarked = (lessonId: number) => {
        return bookmarks.some(b => b.lessonId === lessonId);
    };

    return (
        <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
};
