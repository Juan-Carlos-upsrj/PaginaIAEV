import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';

const BookmarksPage: React.FC = () => {
    const { bookmarks, removeBookmark } = useBookmarks();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ion-icon name="arrow-back-outline"></ion-icon>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <ion-icon name="bookmark" class="text-yellow-500"></ion-icon>
                        Mis Marcadores
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {bookmarks.length > 0 ? (
                    <div className="grid gap-4">
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark.lessonId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/course/${bookmark.courseId}`)}>
                                    <h3 className="font-bold text-gray-900 mb-1">{bookmark.lessonTitle}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <ion-icon name="videocam-outline"></ion-icon>
                                        {bookmark.courseTitle}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeBookmark(bookmark.lessonId)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar marcador"
                                >
                                    <ion-icon name="trash-outline"></ion-icon>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                            <ion-icon name="bookmark-outline"></ion-icon>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes marcadores</h2>
                        <p className="text-gray-500">Guarda tus lecciones favoritas para acceder a ellas rápidamente.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookmarksPage;
