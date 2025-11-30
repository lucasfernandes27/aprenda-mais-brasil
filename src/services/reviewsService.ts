// Serviço para gerenciamento de avaliações de cursos
// Preparado para integração futura com Supabase

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
  async getCourseReviews(courseId: string): Promise<Review[]> {
    try {
      const reviewsData = localStorage.getItem("reviews");
      const allReviews = reviewsData ? JSON.parse(reviewsData) : [];
      
      return allReviews.filter((review: Review) => review.courseId === courseId);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
      return [];
    }
  },

  async getUserReview(courseId: string, userId: string): Promise<Review | null> {
    try {
      const reviewsData = localStorage.getItem("reviews");
      const allReviews = reviewsData ? JSON.parse(reviewsData) : [];
      
      return allReviews.find(
        (review: Review) => review.courseId === courseId && review.userId === userId
      ) || null;
    } catch (error) {
      console.error("Erro ao buscar avaliação do usuário:", error);
      return null;
    }
  },

  async createReview(review: Omit<Review, "id" | "date">): Promise<Review | null> {
    try {
      const reviewsData = localStorage.getItem("reviews");
      const allReviews = reviewsData ? JSON.parse(reviewsData) : [];
      
      const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        date: new Date().toLocaleDateString("pt-BR"),
      };
      
      allReviews.push(newReview);
      localStorage.setItem("reviews", JSON.stringify(allReviews));
      
      return newReview;
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      return null;
    }
  },

  async updateReview(reviewId: string, rating: number, comment: string): Promise<Review | null> {
    try {
      const reviewsData = localStorage.getItem("reviews");
      const allReviews = reviewsData ? JSON.parse(reviewsData) : [];
      
      const reviewIndex = allReviews.findIndex((review: Review) => review.id === reviewId);
      
      if (reviewIndex === -1) {
        return null;
      }
      
      allReviews[reviewIndex] = {
        ...allReviews[reviewIndex],
        rating,
        comment,
        date: new Date().toLocaleDateString("pt-BR"),
      };
      
      localStorage.setItem("reviews", JSON.stringify(allReviews));
      
      return allReviews[reviewIndex];
    } catch (error) {
      console.error("Erro ao atualizar avaliação:", error);
      return null;
    }
  },

  async getCourseAverageRating(courseId: string): Promise<{ average: number; count: number }> {
    try {
      const reviews = await this.getCourseReviews(courseId);
      
      if (reviews.length === 0) {
        return { average: 0, count: 0 };
      }
      
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / reviews.length;
      
      return { average: Math.round(average * 10) / 10, count: reviews.length };
    } catch (error) {
      console.error("Erro ao calcular média de avaliações:", error);
      return { average: 0, count: 0 };
    }
  },
};
