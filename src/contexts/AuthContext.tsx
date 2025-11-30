import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { progressService } from "@/services/progressService";
import { certificatesService } from "@/services/certificatesService";
import { courses } from "@/data/mockData";

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
  certificates: string[]; // IDs dos certificados
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  enrollCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => Promise<void>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<number>;
  unlockAchievement: (achievementId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Carregar usuário usando o serviço
    authService.getCurrentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { user: userData, error } = await authService.login(email, password);

    if (error) {
      toast.error("Erro ao fazer login", {
        description: error,
      });
      return false;
    }

    if (userData) {
      setUser(userData);
      toast.success("Login realizado com sucesso!");
      return true;
    }

    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const { user: userData, error } = await authService.signup(name, email, password);

    if (error) {
      toast.error("Erro ao criar conta", {
        description: error,
      });
      return false;
    }

    if (userData) {
      setUser(userData);
      toast.success("Conta criada com sucesso!");
      return true;
    }

    return false;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  const updateUserData = async (updatedUser: User) => {
    const { user: savedUser, error } = await authService.updateUser(updatedUser);
    
    if (savedUser && !error) {
      setUser(savedUser);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
    };

    updateUserData(updatedUser);
  };

  const enrollCourse = (courseId: string) => {
    if (!user) return;

    if (user.enrolledCourses.includes(courseId)) {
      toast.info("Você já está matriculado neste curso!");
      return;
    }

    const updatedUser = {
      ...user,
      enrolledCourses: [...user.enrolledCourses, courseId],
      courseProgress: { ...user.courseProgress, [courseId]: 0 },
    };

    updateUserData(updatedUser);

    // Desbloquear conquista "Primeiro Passo"
    if (updatedUser.enrolledCourses.length === 1 && !updatedUser.unlockedAchievements.includes("1")) {
      unlockAchievement("1");
    }
  };

  const updateProgress = async (courseId: string, progress: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      courseProgress: { ...user.courseProgress, [courseId]: progress },
    };

    // Se concluiu o curso (100%)
    if (progress === 100 && !user.completedCourses.includes(courseId)) {
      updatedUser.completedCourses = [...user.completedCourses, courseId];
      
      // Gerar certificado automaticamente
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        const certificate = await certificatesService.createCertificate({
          userId: user.id,
          courseId: courseId,
          courseName: course.title,
          studentName: user.name,
          completionDate: new Date().toLocaleDateString("pt-BR"),
          courseHours: course.duration,
        });

        if (certificate) {
          updatedUser.certificates = [...user.certificates, certificate.id];
          
          toast.success("Parabéns! Você concluiu o curso! 🎉", {
            description: "Seu certificado foi gerado automaticamente.",
            duration: 5000,
          });
        }
      }
      
      // Desbloquear conquista "Conquistador"
      if (updatedUser.completedCourses.length === 1 && !updatedUser.unlockedAchievements.includes("3")) {
        setTimeout(() => unlockAchievement("3"), 500);
      }
    }

    await updateUserData(updatedUser);
  };

  const markLessonComplete = async (courseId: string, lessonId: string): Promise<number> => {
    if (!user) return 0;

    // Marcar aula como completa no progressService
    await progressService.markLessonComplete(user.id, courseId, lessonId);

    // Calcular total de aulas do curso
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    // Calcular novo progresso
    const newProgress = await progressService.getCourseProgress(
      user.id,
      courseId,
      totalLessons
    );

    // Atualizar progresso no contexto
    await updateProgress(courseId, newProgress);

    return newProgress;
  };

  const unlockAchievement = (achievementId: string) => {
    if (!user) return;

    if (user.unlockedAchievements.includes(achievementId)) {
      return;
    }

    const updatedUser = {
      ...user,
      unlockedAchievements: [...user.unlockedAchievements, achievementId],
    };

    updateUserData(updatedUser);
    toast.success("Nova conquista desbloqueada! 🏆");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    enrollCourse,
    updateProgress,
    markLessonComplete,
    unlockAchievement,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
