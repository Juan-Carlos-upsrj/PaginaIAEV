import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface Post {
    id: number;
    author: string;
    avatar: string;
    content: string;
    likes: number;
    comments: number;
    timeAgo: string;
    isLiked: boolean;
    courseId?: number; // Optional: if null, it's a general post
    courseName?: string;
}

interface CommunityPageProps {
    courseId?: number; // If provided, shows only posts for this course
    courseName?: string;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ courseId, courseName }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [filter, setFilter] = useState<'all' | 'course'>('all');

    // Load posts from localStorage on mount
    useEffect(() => {
        const savedPosts = localStorage.getItem('iaev_community_posts');
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts));
        } else {
            // Initial mock data
            const initialPosts: Post[] = [
                {
                    id: 1,
                    author: 'Ana García',
                    avatar: 'https://i.pravatar.cc/150?u=ana',
                    content: '¡Acabo de terminar el curso de Diseño Web! 🚀 Altamente recomendado para principiantes.',
                    likes: 12,
                    comments: 3,
                    timeAgo: 'hace 2 horas',
                    isLiked: false,
                    courseId: 1,
                    courseName: 'Diseño Web Moderno'
                },
                {
                    id: 2,
                    author: 'Carlos Ruiz',
                    avatar: 'https://i.pravatar.cc/150?u=carlos',
                    content: '¿Alguien tiene consejos para el renderizado en Houdini? Se me está complicando un poco la iluminación.',
                    likes: 5,
                    comments: 8,
                    timeAgo: 'hace 5 horas',
                    isLiked: false,
                    courseId: 2,
                    courseName: 'Introducción a Houdini'
                }
            ];
            setPosts(initialPosts);
            localStorage.setItem('iaev_community_posts', JSON.stringify(initialPosts));
        }
    }, []);

    // Filter posts based on props and selection
    const displayedPosts = posts.filter(post => {
        if (courseId) {
            // If we are in a specific course page, show only posts for this course
            return post.courseId === courseId;
        } else {
            // If we are in the main community page
            if (filter === 'course') {
                // Show only posts related to courses (mock logic: any post with a courseId)
                return post.courseId !== undefined;
            }
            // 'all': Show everything
            return true;
        }
    });

    const handleLike = (postId: number) => {
        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    isLiked: !post.isLiked
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        localStorage.setItem('iaev_community_posts', JSON.stringify(updatedPosts));
    };

    const handleCreatePost = () => {
        if (!newPostContent.trim() || !user) return;

        const newPost: Post = {
            id: Date.now(),
            author: user.name,
            avatar: `https://ui-avatars.com/api/?name=${user.name}&background=random`,
            content: newPostContent,
            likes: 0,
            comments: 0,
            timeAgo: 'ahora mismo',
            isLiked: false,
            courseId: courseId, // Assign to current course if provided
            courseName: courseName
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem('iaev_community_posts', JSON.stringify(updatedPosts));
        setNewPostContent('');
    };

    if (!user) return null;

    return (
        <div className={`min-h-screen ${courseId ? 'bg-transparent' : 'bg-transparent'} pb-20`}>
            {!courseId && (
                <header className="sticky top-4 z-50 mx-4 mb-8 rounded-2xl glass shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center gap-4">
                                <a href="/dashboard" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors">
                                    <ion-icon name="arrow-back-outline" class="w-6 h-6"></ion-icon>
                                </a>
                                <h1 className="text-2xl font-bold text-gray-800">Comunidad</h1>
                            </div>

                            {/* Filter Toggle */}
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    General
                                </button>
                                <button
                                    onClick={() => setFilter('course')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'course' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Mis Cursos
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className={`${courseId ? '' : 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                {/* Create Post */}
                <div className="glass p-6 rounded-2xl mb-8">
                    <div className="flex gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder={courseId ? `Pregunta algo sobre ${courseName}...` : "¿Qué estás aprendiendo hoy?"}
                                className="w-full bg-gray-50 border-0 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                rows={3}
                            ></textarea>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2 text-gray-400">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <ion-icon name="image-outline" class="w-5 h-5"></ion-icon>
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <ion-icon name="link-outline" class="w-5 h-5"></ion-icon>
                                    </button>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                >
                                    Publicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    {displayedPosts.length > 0 ? (
                        displayedPosts.map(post => (
                            <div key={post.id} className="glass p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">{post.author}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{post.timeAgo}</span>
                                                {post.courseName && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                                                            {post.courseName}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <ion-icon name="ellipsis-horizontal"></ion-icon>
                                    </button>
                                </div>

                                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                                <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                    >
                                        <ion-icon name={post.isLiked ? "heart" : "heart-outline"} class="w-5 h-5"></ion-icon>
                                        {post.likes}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                                        <ion-icon name="chatbubble-outline" class="w-5 h-5"></ion-icon>
                                        {post.comments}
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors ml-auto">
                                        <ion-icon name="share-social-outline" class="w-5 h-5"></ion-icon>
                                        Compartir
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <ion-icon name="chatbubbles-outline" class="text-3xl"></ion-icon>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Aún no hay publicaciones</h3>
                            <p className="text-gray-500">¡Sé el primero en compartir algo!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CommunityPage;
