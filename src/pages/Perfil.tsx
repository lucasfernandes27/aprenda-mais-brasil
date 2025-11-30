import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { courses, achievements } from "@/data/mockData";

const Perfil = () => {
  // Mock user data
  const user = {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    memberSince: "Janeiro 2024",
    enrolledCourses: 3,
    completedCourses: 1,
    unlockedAchievements: 2,
  };

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
                  <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                    MS
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {user.memberSince}</span>
                </div>
                <Button className="w-full" variant="outline">
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
                  <div className="text-3xl font-bold">{user.enrolledCourses}</div>
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
                  <div className="text-3xl font-bold">{user.completedCourses}</div>
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
                    {user.unlockedAchievements}/{achievements.length}
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
      </div>
    </div>
  );
};

export default Perfil;
