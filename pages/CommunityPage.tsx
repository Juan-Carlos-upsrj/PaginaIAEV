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

    const API_URL = import.meta.env.BASE_URL + 'iaev/api';

    // Load posts from API
    const fetchPosts = async () => {
        if (!user) return;
        try {
            const url = new URL(`${API_URL}/community.php`, window.location.origin);
            url.searchParams.append('action', 'get_posts');
            url.searchParams.append('user_id', user.id.toString());
            if (courseId) {
                url.searchParams.append('course_id', courseId.toString());
            }

            const res = await fetch(url.toString());
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    useEffect(() => {
        fetchPosts();
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchPosts, 30000);
        return () => clearInterval(interval);
    }, [user, courseId]);

    // Filter posts based on props and selection
    const displayedPosts = posts.filter(post => {
        if (courseId) {
            return post.courseId === courseId;
        } else {
            if (filter === 'course') {
                return post.courseId !== null;
            }
            return true;
        }
    });

    const handleLike = async (postId: number) => {
        if (!user) return;

        // Optimistic update
        const originalPosts = [...posts];
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

        try {
            await fetch(`${API_URL}/community.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'like_post',
                    user_id: user.id,
                    post_id: postId
                })
            });
        } catch (error) {
            console.error("Failed to like post", error);
            setPosts(originalPosts); // Revert on error
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !user) return;

        try {
            const res = await fetch(`${API_URL}/community.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_post',
                    user_id: user.id,
                    content: newPostContent,
                    course_id: courseId || null
                })
            });

            const data = await res.json();
            if (data.success) {
                setNewPostContent('');
                fetchPosts(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to create post", error);
        }
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
