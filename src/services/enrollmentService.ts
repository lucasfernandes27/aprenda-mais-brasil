// Serviço para gerenciamento de matrículas em cursos usando Supabase
import { supabase } from "@/integrations/supabase/client";

export const enrollmentService = {
  // Matricular em um curso
  async enrollCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("course_enrollments")
        .insert({
          user_id: userId,
          course_id: courseId,
          progress: 0,
        });

      if (error) {
        // Se já está matriculado, ignorar erro
        if (error.code === "23505") {
          return true;
        }
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Erro ao matricular em curso:", error);
      return false;
    }
  },

  // Atualizar progresso de um curso
  async updateCourseProgress(
    userId: string,
    courseId: string,
    progress: number,
    completed: boolean = false
  ): Promise<boolean> {
    try {
      const updateData: any = {
        progress,
      };

      if (completed) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("course_enrollments")
        .update(updateData)
        .eq("user_id", userId)
        .eq("course_id", courseId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      return false;
    }
  },

  // Verificar se está matriculado
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (error) return false;
      return !!data;
    } catch (error) {
      return false;
    }
  },
};
