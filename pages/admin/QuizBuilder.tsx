import React, { useState } from 'react';
import type { Quiz, Question, Answer } from '../../types';

interface QuizBuilderProps {
    quiz?: Quiz;
    onSave: (quiz: Quiz) => void;
    onCancel: () => void;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ quiz: initialQuiz, onSave, onCancel }) => {
    const [quiz, setQuiz] = useState<Quiz>(initialQuiz || {
        id: Date.now(),
        title: 'Nuevo Quiz',
        questions: []
    });

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            text: '',
            answers: [
                { id: Date.now(), text: '', isCorrect: false },
                { id: Date.now() + 1, text: '', isCorrect: false }
            ]
        };
        setQuiz(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    };

    const updateQuestion = (qId: number, text: string) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === qId ? { ...q, text } : q)
        }));
    };

    const deleteQuestion = (qId: number) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== qId)
        }));
    };

    const addAnswer = (qId: number) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === qId) {
                    return {
                        ...q,
                        answers: [...q.answers, { id: Date.now(), text: '', isCorrect: false }]
                    };
                }
                return q;
            })
        }));
    };

    const updateAnswer = (qId: number, aId: number, field: keyof Answer, value: any) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === qId) {
                    return {
                        ...q,
                        answers: q.answers.map(a => a.id === aId ? { ...a, [field]: value } : a)
                    };
                }
                return q;
            })
        }));
    };

    const deleteAnswer = (qId: number, aId: number) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === qId) {
                    return { ...q, answers: q.answers.filter(a => a.id !== aId) };
                }
                return q;
            })
        }));
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Editor de Quiz</h3>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
                    <button onClick={() => onSave(quiz)} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">Guardar Quiz</button>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Quiz</label>
                <input
                    type="text"
                    value={quiz.title}
                    onChange={e => setQuiz({ ...quiz, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q, index) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex justify-between mb-3">
                            <span className="font-bold text-gray-500">Pregunta {index + 1}</span>
                            <button onClick={() => deleteQuestion(q.id)} className="text-red-400 hover:text-red-600">
                                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={q.text}
                            onChange={e => updateQuestion(q.id, e.target.value)}
                            placeholder="Escribe la pregunta..."
                            className="w-full px-3 py-2 mb-3 bg-white rounded-lg border border-gray-300 focus:border-green-500 outline-none"
                        />

                        <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                            {q.answers.map(a => (
                                <div key={a.id} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={a.isCorrect}
                                        onChange={e => updateAnswer(q.id, a.id, 'isCorrect', e.target.checked)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <input
                                        type="text"
                                        value={a.text}
                                        onChange={e => updateAnswer(q.id, a.id, 'text', e.target.value)}
                                        placeholder="Respuesta..."
                                        className={`flex-1 px-3 py-1 rounded-lg border ${a.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'} outline-none`}
                                    />
                                    <button onClick={() => deleteAnswer(q.id, a.id)} className="text-gray-400 hover:text-red-500">
                                        <ion-icon name="close-circle-outline"></ion-icon>
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addAnswer(q.id)} className="text-sm text-blue-500 hover:underline mt-2">
                                + Añadir respuesta
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors">
                    + Añadir Pregunta
                </button>
            </div>
        </div>
    );
};

export default QuizBuilder;
