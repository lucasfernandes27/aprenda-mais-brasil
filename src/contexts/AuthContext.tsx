import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";

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
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  enrollCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
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

  const updateProgress = (courseId: string, progress: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      courseProgress: { ...user.courseProgress, [courseId]: progress },
    };

    // Se concluiu o curso (100%)
    if (progress === 100 && !user.completedCourses.includes(courseId)) {
      updatedUser.completedCourses = [...user.completedCourses, courseId];
      
      // Desbloquear conquista "Conquistador"
      if (updatedUser.completedCourses.length === 1 && !updatedUser.unlockedAchievements.includes("3")) {
        setTimeout(() => unlockAchievement("3"), 500);
      }
    }

    updateUserData(updatedUser);
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
    unlockAchievement,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
