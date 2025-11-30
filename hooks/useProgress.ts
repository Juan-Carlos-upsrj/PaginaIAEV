import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export const useProgress = () => {
  const { user, updateUserProgress } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const completeLesson = useCallback(async (lessonId: number) => {
    if (!user || user.completedLessons.includes(lessonId)) {
      return;
    }

    setIsUpdating(true);
    try {
      await api.completeLesson(user.id, lessonId);

      // Actualizar estado local
      const newCompletedLessons = [...user.completedLessons, lessonId];
      const xpGain = 50;
      const newXp = user.xp + xpGain;
      const newLevel = Math.floor(newXp / 100) + 1;

      updateUserProgress({
        completedLessons: newCompletedLessons,
        xp: newXp,
        level: newLevel,
      });

      // Sincronizar XP con backend
      await api.updateXP(user.id, newXp, newLevel);

      // Mostrar notificación de XP ganado
      showNotification(`+${xpGain} XP`, 'success');

      if (newLevel > user.level) {
        showNotification(`¡Subiste al Nivel ${newLevel}!`, 'success');
      }

      return { xpGain, newLevel };
    } catch (error) {
      console.error('Error completing lesson:', error);
      showNotification('Error al guardar progreso', 'error');
    } finally {
      setIsUpdating(false);
    }
  }, [user, updateUserProgress]);

  const completeQuiz = useCallback(async (quizId: number, score: number, total: number) => {
    if (!user || user.completedQuizzes.includes(quizId)) {
      return;
    }

    setIsUpdating(true);
    try {
      await api.completeQuiz(user.id, quizId, score);

      // Actualizar estado local
      const newCompletedQuizzes = [...user.completedQuizzes, quizId];
      const xpGain = score * 10; // 10 XP por respuesta correcta
      const newXp = user.xp + xpGain;
      const newLevel = Math.floor(newXp / 100) + 1;

      updateUserProgress({
        completedQuizzes: newCompletedQuizzes,
        xp: newXp,
        level: newLevel,
      });

      // Sincronizar con backend
      await api.updateXP(user.id, newXp, newLevel);

      showNotification(`+${xpGain} XP por el quiz`, 'success');

      if (newLevel > user.level) {
        showNotification(`¡Subiste al Nivel ${newLevel}!`, 'success');
      }

      return { xpGain, newLevel };
    } catch (error) {
      console.error('Error completing quiz:', error);
      showNotification('Error al guardar progreso del quiz', 'error');
    } finally {
      setIsUpdating(false);
    }
  }, [user, updateUserProgress]);

  return { completeLesson, completeQuiz, isUpdating };
};

// Sistema de notificaciones simple
const showNotification = (message: string, type: 'success' | 'error') => {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.classList.add('animate-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};
