import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
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
    // Carregar usuário do localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Buscar usuários do localStorage
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : {};

      const userKey = email.toLowerCase();
      const storedUser = users[userKey];

      if (!storedUser) {
        toast.error("Usuário não encontrado", {
          description: "Verifique seu e-mail ou crie uma conta.",
        });
        return false;
      }

      if (storedUser.password !== password) {
        toast.error("Senha incorreta", {
          description: "Por favor, tente novamente.",
        });
        return false;
      }

      const userData: User = {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        enrolledCourses: storedUser.enrolledCourses || [],
        completedCourses: storedUser.completedCourses || [],
        courseProgress: storedUser.courseProgress || {},
        unlockedAchievements: storedUser.unlockedAchievements || [],
        memberSince: storedUser.memberSince,
      };

      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao fazer login", {
        description: "Por favor, tente novamente.",
      });
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Buscar usuários do localStorage
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : {};

      const userKey = email.toLowerCase();

      if (users[userKey]) {
        toast.error("E-mail já cadastrado", {
          description: "Use outro e-mail ou faça login.",
        });
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        enrolledCourses: [],
        completedCourses: [],
        courseProgress: {},
        unlockedAchievements: [],
        memberSince: new Date().toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
      };

      users[userKey] = newUser;
      localStorage.setItem("users", JSON.stringify(users));

      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        enrolledCourses: [],
        completedCourses: [],
        courseProgress: {},
        unlockedAchievements: [],
        memberSince: newUser.memberSince,
      };

      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      toast.success("Conta criada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao criar conta", {
        description: "Por favor, tente novamente.",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast.success("Logout realizado com sucesso!");
  };

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Atualizar também no registro de usuários
    const usersData = localStorage.getItem("users");
    const users = usersData ? JSON.parse(usersData) : {};
    const userKey = updatedUser.email.toLowerCase();
    
    if (users[userKey]) {
      users[userKey] = {
        ...users[userKey],
        enrolledCourses: updatedUser.enrolledCourses,
        completedCourses: updatedUser.completedCourses,
        courseProgress: updatedUser.courseProgress,
        unlockedAchievements: updatedUser.unlockedAchievements,
      };
      localStorage.setItem("users", JSON.stringify(users));
    }
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
    enrollCourse,
    updateProgress,
    unlockAchievement,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
