// Serviço de autenticação usando Supabase
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  courseProgress: Record<string, number>;
  unlockedAchievements: string[];
  certificates: string[];
  memberSince: string;
}

export const authService = {
  // Login com email e senha
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: "Erro ao fazer login" };
      }

      // Buscar dados do perfil
      const user = await this.getCurrentUser();
      return { user, error: null };
    } catch (error) {
      console.error("Erro no login:", error);
      return { user: null, error: "Erro ao fazer login" };
    }
  },

  // Cadastro de novo usuário
  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: "Erro ao criar conta" };
      }

      // Aguardar um momento para o trigger criar o perfil
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar o usuário recém-criado
      const user = await this.getCurrentUser();
      return { user, error: null };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { user: null, error: "Erro ao criar conta" };
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return null;
      }

      // Buscar perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profile) {
        return null;
      }

      // Buscar matrículas
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", authUser.id);

      const enrolledCourses = enrollments?.map(e => e.course_id) || [];
      const completedCourses = enrollments?.filter(e => e.progress === 100).map(e => e.course_id) || [];
      const courseProgress: Record<string, number> = {};
      enrollments?.forEach(e => {
        courseProgress[e.course_id] = e.progress;
      });

      // Buscar conquistas
      const { data: achievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", authUser.id);

      const unlockedAchievements = achievements?.map(a => a.achievement_id) || [];

      // Buscar certificados
      const { data: certificates } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", authUser.id);

      const certificateIds = certificates?.map(c => c.id) || [];

      return {
        id: authUser.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar || undefined,
        bio: profile.bio || undefined,
        enrolledCourses,
        completedCourses,
        courseProgress,
        unlockedAchievements,
        certificates: certificateIds,
        memberSince: profile.member_since,
      };
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      return null;
    }
  },

  // Atualizar usuário
  async updateUser(user: User): Promise<{ user: User | null; error: string | null }> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
        })
        .eq("id", user.id);

      if (error) {
        return { user: null, error: error.message };
      }

      // Buscar usuário atualizado
      const updatedUser = await this.getCurrentUser();
      return { user: updatedUser, error: null };
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return { user: null, error: "Erro ao atualizar perfil" };
    }
  },

  // Logout
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },
};
