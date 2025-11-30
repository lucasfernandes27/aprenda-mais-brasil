// Camada de serviço para cursos
// Por enquanto importa dados mockados, mas preparado para migrar para Supabase

import { courses as mockCourses } from "@/data/mockData";
import type { Course } from "@/data/mockData";

// Futuramente, essas funções farão requisições ao Supabase
export const coursesService = {
  async getAllCourses(): Promise<Course[]> {
    // Futuramente: return await supabase.from('courses').select('*')
    return mockCourses;
  },

  async getCourseById(courseId: string): Promise<Course | null> {
    // Futuramente: return await supabase.from('courses').select('*').eq('id', courseId).single()
    const course = mockCourses.find((c) => c.id === courseId);
    return course || null;
  },

  async searchCourses(searchTerm: string, category?: string): Promise<Course[]> {
    // Futuramente: query do Supabase com filtros
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !category || category === "Todos" || course.category === category;
      return matchesSearch && matchesCategory;
    });
  },
};
