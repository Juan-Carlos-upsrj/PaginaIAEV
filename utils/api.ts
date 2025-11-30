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

  // Admin Methods
  async getStudents() {
    return this.request('/admin.php?action=get_students');
  }

  async getTeachers() {
    return this.request('/admin.php?action=get_teachers');
  }

  async getAuthorizedEmails() {
    return this.request('/admin.php?action=get_authorized_emails');
  }

  async getGroups() {
    return this.request('/admin.php?action=get_groups');
  }

  async getGlobalStats() {
    return this.request('/admin.php?action=get_global_stats');
  }

  async authorizeEmail(email: string) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'authorize_email', email }),
    });
  }

  async bulkAuthorizeEmails(emails: string[]) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'bulk_authorize_emails', emails }),
    });
  }

  async assignCourseToTeacher(teacherId: string, courseId: number) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'assign_course', teacher_id: teacherId, course_id: courseId }),
    });
  }

  async updateStudentStatus(studentId: string, status: 'active' | 'inactive') {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'update_student_status', id: studentId, status }),
    });
  }

  async addGroup(name: string) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'add_group', name }),
    });
  }

  async removeGroup(name: string) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'remove_group', name }),
    });
  }

  async updateGroup(oldName: string, newName: string) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'update_group', old_name: oldName, new_name: newName }),
    });
  }

  async createTeacher(teacherData: any) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'create_teacher', ...teacherData }),
    });
  }

  async updateTeacher(teacherData: any) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'update_teacher', ...teacherData }),
    });
  }

  async updateStudent(studentData: any) {
    return this.request('/admin.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'update_student', ...studentData }),
    });
  }
}

// Instancia singleton
export const api = new APIClient();
