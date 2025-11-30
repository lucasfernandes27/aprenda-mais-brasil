// Serviço para gerenciamento de progresso de aulas
// Preparado para integração futura com Supabase

export interface LessonProgress {
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export const progressService = {
  // Buscar progresso de todas as aulas de um usuário
  async getUserProgress(userId: string): Promise<LessonProgress[]> {
    try {
      const progressData = localStorage.getItem(`progress_${userId}`);
      return progressData ? JSON.parse(progressData) : [];
    } catch (error) {
      console.error("Erro ao buscar progresso:", error);
      return [];
    }
  },

  // Marcar uma aula como completa
  async markLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<boolean> {
    try {
      const progress = await this.getUserProgress(userId);
      
      // Verificar se já está marcada
      const existingIndex = progress.findIndex(
        (p) => p.courseId === courseId && p.lessonId === lessonId
      );

      if (existingIndex === -1) {
        progress.push({
          courseId,
          lessonId,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      } else {
        progress[existingIndex].completed = true;
        progress[existingIndex].completedAt = new Date().toISOString();
      }

      localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error("Erro ao marcar aula como completa:", error);
      return false;
    }
  },

  // Verificar se uma aula está completa
  async isLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<boolean> {
    try {
      const progress = await this.getUserProgress(userId);
      const lesson = progress.find(
        (p) => p.courseId === courseId && p.lessonId === lessonId && p.completed
      );
      return !!lesson;
    } catch (error) {
      console.error("Erro ao verificar progresso da aula:", error);
      return false;
    }
  },

  // Calcular progresso de um curso
  async getCourseProgress(
    userId: string,
    courseId: string,
    totalLessons: number
  ): Promise<number> {
    try {
      if (totalLessons === 0) return 0;
      
      const progress = await this.getUserProgress(userId);
      const completedLessons = progress.filter(
        (p) => p.courseId === courseId && p.completed
      ).length;

      // Usar Math.floor para evitar problemas de arredondamento
      // e garantir que só chegue a 100% quando TODAS as aulas estiverem completas
      const percentage = (completedLessons / totalLessons) * 100;
      return completedLessons === totalLessons ? 100 : Math.floor(percentage);
    } catch (error) {
      console.error("Erro ao calcular progresso do curso:", error);
      return 0;
    }
  },

  // Obter IDs das aulas completas de um curso
  async getCompletedLessonIds(userId: string, courseId: string): Promise<string[]> {
    try {
      const progress = await this.getUserProgress(userId);
      return progress
        .filter((p) => p.courseId === courseId && p.completed)
        .map((p) => p.lessonId);
    } catch (error) {
      console.error("Erro ao buscar aulas completas:", error);
      return [];
    }
  },
};
