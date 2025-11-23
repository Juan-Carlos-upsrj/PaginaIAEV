import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useUser } from '../context/UserContext';
import { useBookmarks } from '../context/BookmarkContext';
import QuizComponent from '../components/QuizComponent';
import CommunityPage from './CommunityPage';
import Confetti from '../components/Confetti';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourse } = useCourses();
  const { completeQuiz } = useUser();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const course = useMemo(() => {
    return getCourse(Number(courseId));
  }, [courseId, getCourse]);

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Curso no encontrado</h2>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const handleLessonSelect = (mIndex: number, lIndex: number) => {
    setCurrentModuleIndex(mIndex);
    setCurrentLessonIndex(lIndex);
    setShowQuiz(false); // Reset quiz view when changing lessons
    setShowCommunity(false); // Reset to lesson view when changing lessons
  };

  const handleExitCourse = () => {
    navigate('/dashboard');
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (currentLesson && currentLesson.quiz) {
      completeQuiz(currentLesson.quiz.id, score);
      if (score / total >= 0.8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const toggleBookmark = () => {
    if (!currentLesson) return;

    if (isBookmarked(currentLesson.id)) {
      removeBookmark(currentLesson.id);
    } else {
      addBookmark({
        courseId: course.id,
        lessonId: currentLesson.id,
        courseTitle: course.title,
        lessonTitle: currentLesson.title
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Confetti trigger={showConfetti} />
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={handleExitCourse} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </button>
            <h1 className="font-bold text-gray-900 truncate" title={course.title}>{course.title}</h1>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-full w-1/3 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">33% Completado</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {course.modules.map((module, mIndex) => (
            <div key={module.id} className="border-b border-gray-50">
              <div className="px-6 py-4 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{module.title}</h3>
              </div>
              <div>
                {module.lessons.map((lesson, lIndex) => {
                  const isActive = mIndex === currentModuleIndex && lIndex === currentLessonIndex;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(mIndex, lIndex)}
                      className={`w-full px-6 py-4 flex items-center gap-3 text-left transition-all hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500' : 'border-transparent'
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${isActive ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-400'
                        }`}>
                        {isActive ? <ion-icon name="play"></ion-icon> : lIndex + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <ion-icon name="time-outline"></ion-icon>
                          {lesson.duration}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Tabs Header */}
        <div className="bg-white border-b border-gray-200 px-8 pt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-8">
              <button
                onClick={() => setShowCommunity(false)}
                className={`pb-4 text-sm font-bold border-b-2 transition-colors ${!showCommunity ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Lección Actual
              </button>
              <button
                onClick={() => setShowCommunity(true)}
                className={`pb-4 text-sm font-bold border-b-2 transition-colors ${showCommunity ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Foro del Curso
              </button>
            </div>

            {!showCommunity && currentLesson && (
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full transition-colors ${isBookmarked(currentLesson.id) ? 'bg-yellow-100 text-yellow-500' : 'hover:bg-gray-100 text-gray-400'}`}
                title={isBookmarked(currentLesson.id) ? "Quitar marcador" : "Marcar lección"}
              >
                <ion-icon name={isBookmarked(currentLesson.id) ? "bookmark" : "bookmark-outline"} class="text-xl"></ion-icon>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {showCommunity ? (
              <CommunityPage courseId={course.id} courseName={course.title} />
            ) : (
              currentLesson ? (
                <>
                  {showQuiz && currentLesson.quiz ? (
                    <div className="animate-fade-in">
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <ion-icon name="arrow-back-outline"></ion-icon>
                        Volver a la lección
                      </button>
                      <QuizComponent quiz={currentLesson.quiz} onComplete={handleQuizComplete} />
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <div className="aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden mb-8 ring-1 ring-gray-900/5">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                          title={currentLesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>

                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                          <p className="text-gray-600 text-lg leading-relaxed">{currentLesson.description}</p>
                        </div>

                        {currentLesson.quiz && (
                          <button
                            onClick={() => setShowQuiz(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all"
                          >
                            <ion-icon name="school-outline" class="text-xl"></ion-icon>
                            Tomar Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Selecciona una lección para comenzar
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;