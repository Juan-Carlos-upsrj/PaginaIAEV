export class APIClient {
  private baseURL: string;

  constructor() {
    // Detectar entorno automáticamente
    const isDev = window.location.hostname === 'localhost';
    this.baseURL = isDev
      ? 'http://localhost:3000/api'
      : `${window.location.origin}/iaev/api`;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Para cookies de sesión
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error en la operación');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(email: string, password: string) {
    return this.request('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password }),
    });
  }

  async register(userData: { email: string; password: string; name: string; role: 'student' | 'teacher'; cuatrimestre?: number; }) {
    return this.request('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', ...userData }),
    });
  }

  async checkSession() {
    return this.request('/auth.php?action=check_session');
  }

  async logout() {
    return this.request('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' }),
    });
  }

  // Métodos de progreso
  async completeLesson(userId: string, lessonId: number) {
    return this.request('/progress.php', {
      method: 'POST',
      body: JSON.stringify({
        action: 'complete_lesson',
        userId,
        lessonId,
      }),
    });
  }

  async completeQuiz(userId: string, quizId: number, score: number) {
    return this.request('/progress.php', {
      method: 'POST',
      body: JSON.stringify({
        action: 'complete_quiz',
        userId,
        quizId,
        score,
      }),
    });
  }

  async updateXP(userId: string, xp: number, level: number) {
    return this.request('/progress.php', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update_xp',
        userId,
        xp,
        level,
      }),
    });
  }

  // Métodos de cursos
  async getCourses() {
    return this.request('/courses.php?action=get_courses');
  }

  async createCourse(courseData: any) {
    return this.request('/courses.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'create_course', ...courseData }),
    });
  }

  async updateCourse(courseData: any) {
    return this.request('/courses.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'update_course', ...courseData }),
    });
  }
}

// Instancia singleton
export const api = new APIClient();
