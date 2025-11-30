// Serviço para gerenciamento de progresso de aulas usando Supabase
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return data?.map(item => ({
        courseId: item.course_id,
        lessonId: item.lesson_id,
        completed: item.completed,
        completedAt: item.completed_at,
      })) || [];
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
      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,course_id,lesson_id"
        });

      if (error) throw error;
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
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("completed")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .eq("lesson_id", lessonId)
        .single();

      if (error) return false;
      return data?.completed || false;
    } catch (error) {
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

      const { data, error } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .eq("completed", true);

      if (error) throw error;

      const completedLessons = data?.length || 0;
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
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .eq("completed", true);

      if (error) throw error;
      return data?.map(item => item.lesson_id) || [];
    } catch (error) {
      console.error("Erro ao buscar aulas completas:", error);
      return [];
    }
  },
};
