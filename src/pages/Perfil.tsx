import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Mail, Calendar, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { courses, achievements } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import EditProfileDialog from "@/components/EditProfileDialog";
import { toast } from "sonner";

const Perfil = () => {
  const { user: authUser, updateUser } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!authUser) return null;

  const handleSaveProfile = (updates: Partial<typeof authUser>) => {
    updateUser(updates);
    toast.success("Perfil atualizado com sucesso!");
  };

  const enrolledCoursesCount = authUser.enrolledCourses.length;
  const completedCoursesCount = authUser.completedCourses.length;
  const unlockedAchievementsCount = authUser.unlockedAchievements.length;

  // Pegar iniciais do nome
  const initials = authUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8">Meu Perfil</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  {authUser.avatar ? (
                    <img src={authUser.avatar} alt={authUser.name} className="object-cover" />
                  ) : (
                    <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-2xl">{authUser.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {authUser.email}
                </CardDescription>
                {authUser.bio && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {authUser.bio}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {authUser.memberSince}</span>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar perfil
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Cursos Matriculados
                    </CardTitle>
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{enrolledCoursesCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Cursos Concluídos
                    </CardTitle>
                    <Trophy className="w-4 h-4 text-success" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completedCoursesCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Conquistas
                    </CardTitle>
                    <Trophy className="w-4 h-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {unlockedAchievementsCount}/{achievements.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade recente</CardTitle>
                <CardDescription>
                  Suas últimas ações na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Completou o módulo 3 de Excel Avançado</p>
                    <p className="text-sm text-muted-foreground">Há 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Desbloqueou a conquista "Primeiro Passo"</p>
                    <p className="text-sm text-muted-foreground">Há 1 dia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Matriculou-se em PowerPoint Profissional</p>
                    <p className="text-sm text-muted-foreground">Há 2 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Áreas de conhecimento</CardTitle>
                <CardDescription>
                  Suas principais habilidades em desenvolvimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    Excel
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    Word
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    PowerPoint
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    Análise de Dados
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    Produtividade
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={authUser}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
};

export default Perfil;
