import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useCourses } from '../context/CourseContext';

const ProfilePage: React.FC = () => {
    const { user, updateProfile, switchProfile } = useUser();
    const { courses } = useCourses();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || '',
        twitter: user?.socialLinks?.twitter || '',
        linkedin: user?.socialLinks?.linkedin || '',
        github: user?.socialLinks?.github || '',
        website: user?.socialLinks?.website || ''
    });

    if (!user) return null;

    const completedCoursesCount = courses.filter(c =>
        c.modules.every(m => m.lessons.every(l => user.completedLessons.includes(l.id)))
    ).length;

    const totalLearningHours = Math.round((user.completedLessons.length * 15) / 60);

    const handleSave = () => {
        updateProfile({
            name: formData.name,
            bio: formData.bio,
            avatar: formData.avatar,
            socialLinks: {
                twitter: formData.twitter,
                linkedin: formData.linkedin,
                github: formData.github,
                website: formData.website
            }
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                    <div className="relative flex flex-col md:flex-row items-end gap-6 pt-12 px-4">
                        <div className="relative group">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random&size=200`}
                                alt={user.name}
                                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover bg-white"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ion-icon name="camera-outline" class="text-white text-3xl"></ion-icon>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 mb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                            {user.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                                            Nivel {user.level}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={`px-6 py-2 rounded-xl font-bold transition-all ${isEditing ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="mt-8 px-4">
                        <div className="flex justify-between text-sm mb-2 font-medium text-gray-600 dark:text-gray-300">
                            <span>XP: {user.xp}</span>
                            <span>Siguiente Nivel: {user.level * 100} XP</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${(user.xp % 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Bio & Socials */}
                    <div className="space-y-8">
                        {/* Bio Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ion-icon name="person-outline" class="text-blue-500"></ion-icon> Sobre Mí
                            </h3>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]"
                                    placeholder="Cuéntanos un poco sobre ti..."
                                />
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {user.bio || "Aún no has añadido una biografía."}
                                </p>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ion-icon name="share-social-outline" class="text-purple-500"></ion-icon> Redes Sociales
                            </h3>
                            <div className="space-y-3">
                                {['twitter', 'linkedin', 'github', 'website'].map((platform) => (
                                    <div key={platform} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                                            <ion-icon name={platform === 'website' ? 'globe-outline' : `logo-${platform}`}></ion-icon>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={(formData as any)[platform]}
                                                onChange={(e) => setFormData({ ...formData, [platform]: e.target.value })}
                                                placeholder={`Tu usuario de ${platform}`}
                                                className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            (user.socialLinks as any)?.[platform] ? (
                                                <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
                                                    {(user.socialLinks as any)[platform]}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">No conectado</span>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Achievements */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-1">{completedCoursesCount}</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cursos Completados</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 text-center">
                                <div className="text-4xl font-bold text-purple-600 mb-1">{totalLearningHours}h</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Horas de Aprendizaje</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 text-center">
                                <div className="text-4xl font-bold text-green-600 mb-1">{user.achievements.length}</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Logros Desbloqueados</div>
                            </div>
                        </div>

                        {/* Achievements Gallery */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <ion-icon name="trophy-outline" class="text-yellow-500"></ion-icon> Tus Logros
                            </h3>

                            {user.achievements.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {user.achievements.map((achievement) => (
                                        <div key={achievement.id} className="flex flex-col items-center text-center group">
                                            <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-4xl text-yellow-600 dark:text-yellow-400 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/20">
                                                <ion-icon name={achievement.icon}></ion-icon>
                                            </div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{achievement.title}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{achievement.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-gray-400">
                                        <ion-icon name="lock-closed-outline"></ion-icon>
                                    </div>
                                    <p className="text-gray-500">Aún no has desbloqueado logros. ¡Completa lecciones para ganar insignias!</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                {/* Dev Tools Section */}
                <div className="bg-gray-800 text-white rounded-3xl p-8 shadow-xl border border-gray-700">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ion-icon name="construct-outline" class="text-yellow-500"></ion-icon> Herramientas de Desarrollo
                    </h3>
                    <p className="text-gray-400 mb-4">Selecciona un perfil para probar diferentes escenarios de Kardex:</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['new_student', 'advanced_student', 'irregular_student'].map(profileId => {
                            const labels: Record<string, string> = {
                                'new_student': 'Nuevo Ingreso (1º Cuatri)',
                                'advanced_student': 'Avanzado (4º Cuatri)',
                                'irregular_student': 'Irregular (Reprobadas)'
                            };

                            return (
                                <button
                                    key={profileId}
                                    onClick={() => switchProfile(profileId)}
                                    className={`p-4 rounded-xl border transition-all text-left ${user.id === profileId
                                        ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                                >
                                    <div className="font-bold">{labels[profileId]}</div>
                                    <div className="text-xs text-gray-300 mt-1">ID: {profileId}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
