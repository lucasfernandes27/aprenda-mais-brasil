// Serviço para gerenciamento de certificados usando Supabase
import { supabase } from "@/integrations/supabase/client";

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completionDate: string;
  courseHours: string;
}

export const certificatesService = {
  // Buscar todos os certificados de um usuário
  async getCertificates(userId: string): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data?.map(cert => ({
        id: cert.id,
        userId: cert.user_id,
        courseId: cert.course_id,
        courseName: cert.course_name,
        studentName: cert.student_name,
        completionDate: cert.completion_date,
        courseHours: cert.course_hours,
      })) || [];
    } catch (error) {
      console.error("Erro ao buscar certificados:", error);
      return [];
    }
  },

  // Buscar um certificado específico
  async getCertificate(certificateId: string): Promise<Certificate | null> {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", certificateId)
        .single();

      if (error) throw error;

      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        courseId: data.course_id,
        courseName: data.course_name,
        studentName: data.student_name,
        completionDate: data.completion_date,
        courseHours: data.course_hours,
      };
    } catch (error) {
      console.error("Erro ao buscar certificado:", error);
      return null;
    }
  },

  // Criar um novo certificado
  async createCertificate(
    certificate: Omit<Certificate, "id">
  ): Promise<Certificate | null> {
    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", certificate.userId)
        .eq("course_id", certificate.courseId)
        .maybeSingle();

      if (existing) {
        return {
          id: existing.id,
          userId: existing.user_id,
          courseId: existing.course_id,
          courseName: existing.course_name,
          studentName: existing.student_name,
          completionDate: existing.completion_date,
          courseHours: existing.course_hours,
        };
      }

      const { data, error } = await supabase
        .from("certificates")
        .insert({
          user_id: certificate.userId,
          course_id: certificate.courseId,
          course_name: certificate.courseName,
          student_name: certificate.studentName,
          completion_date: certificate.completionDate,
          course_hours: certificate.courseHours,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        courseId: data.course_id,
        courseName: data.course_name,
        studentName: data.student_name,
        completionDate: data.completion_date,
        courseHours: data.course_hours,
      };
    } catch (error) {
      console.error("Erro ao criar certificado:", error);
      return null;
    }
  },
};
