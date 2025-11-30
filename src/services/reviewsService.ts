// Serviço para gerenciamento de avaliações de cursos usando Supabase
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviewsService = {
  // Buscar todas as avaliações de um curso
  async getCourseReviews(courseId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from("course_reviews")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data?.map(review => ({
        id: review.id,
        courseId: review.course_id,
        userId: review.user_id,
        userName: review.user_name,
        rating: review.rating,
        comment: review.comment || "",
        date: review.created_at,
      })) || [];
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
      return [];
    }
  },

  // Buscar avaliação de um usuário específico para um curso
  async getUserReview(courseId: string, userId: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from("course_reviews")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        courseId: data.course_id,
        userId: data.user_id,
        userName: data.user_name,
        rating: data.rating,
        comment: data.comment || "",
        date: data.created_at,
      };
    } catch (error) {
      return null;
    }
  },

  // Criar nova avaliação
  async createReview(
    review: Omit<Review, "id" | "date">
  ): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from("course_reviews")
        .insert({
          course_id: review.courseId,
          user_id: review.userId,
          user_name: review.userName,
          rating: review.rating,
          comment: review.comment,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        courseId: data.course_id,
        userId: data.user_id,
        userName: data.user_name,
        rating: data.rating,
        comment: data.comment || "",
        date: data.created_at,
      };
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      return null;
    }
  },

  // Atualizar avaliação existente
  async updateReview(
    reviewId: string,
    rating: number,
    comment: string
  ): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from("course_reviews")
        .update({
          rating,
          comment,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        courseId: data.course_id,
        userId: data.user_id,
        userName: data.user_name,
        rating: data.rating,
        comment: data.comment || "",
        date: data.updated_at,
      };
    } catch (error) {
      console.error("Erro ao atualizar avaliação:", error);
      return null;
    }
  },

  // Calcular média de avaliações de um curso
  async getCourseAverageRating(
    courseId: string
  ): Promise<{ average: number; count: number }> {
    try {
      const { data, error } = await supabase
        .from("course_reviews")
        .select("rating")
        .eq("course_id", courseId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      const average = Number((sum / data.length).toFixed(1));

      return { average, count: data.length };
    } catch (error) {
      console.error("Erro ao calcular média de avaliações:", error);
      return { average: 0, count: 0 };
    }
  },
};
