import React, { useState } from 'react';
import type { Quiz, Question, Answer } from '../types';

interface QuizComponentProps {
    quiz: Quiz;
    onComplete: (score: number, total: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // questionId -> answerId
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleAnswerSelect = (answerId: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answerId
        }));
    };

    const handleNext = () => {
        if (isLastQuestion) {
            calculateResults();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const calculateResults = () => {
        let correctCount = 0;
        quiz.questions.forEach(q => {
            const selectedAnswerId = selectedAnswers[q.id];
            const correctAnswer = q.answers.find(a => a.isCorrect);
            if (correctAnswer && correctAnswer.id === selectedAnswerId) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setShowResults(true);
        onComplete(correctCount, quiz.questions.length);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
    };

    if (showResults) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto mt-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <ion-icon name="trophy" class="text-5xl text-white"></ion-icon>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Quiz Completado!</h2>
                <p className="text-gray-600 mb-6">Has demostrado tus conocimientos.</p>

                <div className="flex justify-center gap-8 mb-8">
                    <div className="text-center">
                        <div className="text-4xl font-extrabold text-gray-900">{score}/{quiz.questions.length}</div>
                        <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Aciertos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-extrabold text-green-600">{percentage}%</div>
                        <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Puntuación</div>
                    </div>
                </div>

                <button
                    onClick={resetQuiz}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Intentar de Nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{quiz.title}</h3>
                    <span className="text-sm text-gray-500">Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</span>
                </div>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.text}</h4>
                <div className="space-y-3">
                    {currentQuestion.answers.map(answer => {
                        const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
                        return (
                            <button
                                key={answer.id}
                                onClick={() => handleAnswerSelect(answer.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isSelected
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <span className="font-medium">{answer.text}</span>
                                {isSelected && (
                                    <ion-icon name="checkmark-circle" class="text-xl text-blue-500"></ion-icon>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!selectedAnswers[currentQuestion.id]}
                    className={`px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${selectedAnswers[currentQuestion.id]
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    {isLastQuestion ? 'Finalizar Quiz' : 'Siguiente Pregunta'}
                    <ion-icon name={isLastQuestion ? "checkmark-done-outline" : "arrow-forward-outline"}></ion-icon>
                </button>
            </div>
        </div>
    );
};

export default QuizComponent;
