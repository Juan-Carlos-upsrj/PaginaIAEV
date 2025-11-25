import React from 'react';
import type { Lesson } from '../types';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">{lesson.title}</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {lesson.description}
      </p>
    </div>
  );
};

export default LessonContent;