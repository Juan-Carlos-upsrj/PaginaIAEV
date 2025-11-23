import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
        const saved = localStorage.getItem('bookmarks');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const addBookmark = (bookmark: Omit<Bookmark, 'timestamp'>) => {
        setBookmarks(prev => {
            if (prev.some(b => b.lessonId === bookmark.lessonId)) return prev;
            return [...prev, { ...bookmark, timestamp: Date.now() }];
        });
    };

    const removeBookmark = (lessonId: number) => {
        setBookmarks(prev => prev.filter(b => b.lessonId !== lessonId));
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
