// Camada de serviço para autenticação
// Por enquanto usa localStorage, mas preparado para migrar para Supabase

interface User {
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

interface StoredUser extends User {
  password: string;
}

// Futuramente, essas funções serão substituídas por chamadas ao Supabase
export const authService = {
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : {};

      const userKey = email.toLowerCase();
      const storedUser: StoredUser = users[userKey];

      if (!storedUser) {
        return { user: null, error: "Usuário não encontrado" };
      }

      if (storedUser.password !== password) {
        return { user: null, error: "Senha incorreta" };
      }

      const userData: User = {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        avatar: storedUser.avatar,
        bio: storedUser.bio,
        enrolledCourses: storedUser.enrolledCourses || [],
        completedCourses: storedUser.completedCourses || [],
        courseProgress: storedUser.courseProgress || {},
        unlockedAchievements: storedUser.unlockedAchievements || [],
        memberSince: storedUser.memberSince,
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: "Erro ao fazer login" };
    }
  },

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : {};

      const userKey = email.toLowerCase();

      if (users[userKey]) {
        return { user: null, error: "E-mail já cadastrado" };
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        avatar: "",
        bio: "",
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
        avatar: newUser.avatar,
        bio: newUser.bio,
        enrolledCourses: [],
        completedCourses: [],
        courseProgress: {},
        unlockedAchievements: [],
        memberSince: newUser.memberSince,
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: "Erro ao criar conta" };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async updateUser(user: User): Promise<{ user: User | null; error: string | null }> {
    try {
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Atualizar também no registro de usuários
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : {};
      const userKey = user.email.toLowerCase();

      if (users[userKey]) {
        users[userKey] = {
          ...users[userKey],
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          enrolledCourses: user.enrolledCourses,
          completedCourses: user.completedCourses,
          courseProgress: user.courseProgress,
          unlockedAchievements: user.unlockedAchievements,
        };
        localStorage.setItem("users", JSON.stringify(users));
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error: "Erro ao atualizar usuário" };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("currentUser");
  },
};
