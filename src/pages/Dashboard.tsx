import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/mockData";
import ProgressBar from "@/components/ProgressBar";
import { BookOpen, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { progressService } from "@/services/progressService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseProgresses, setCourseProgresses] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadProgresses = async () => {
      if (!user) return;
      
      const progresses: Record<string, number> = {};
      
      for (const courseId of user.enrolledCourses) {
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          const totalLessons = course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0
          );
          const progress = await progressService.getCourseProgress(
            user.id,
            courseId,
            totalLessons
          );
          progresses[courseId] = progress;
        }
      }
      
      setCourseProgresses(progresses);
    };

    loadProgresses();
  }, [user?.id, user?.enrolledCourses.length]);

  // Buscar cursos matriculados do usuário
  const enrolledCourses = courses
    .filter((course) => user?.enrolledCourses.includes(course.id))
    .map((course) => ({
      ...course,
      enrolled: true,
      progress: courseProgresses[course.id] ?? user?.courseProgress[course.id] ?? 0,
    }));

  const completedCourses = enrolledCourses.filter((c) => c.progress === 100).length;

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Olá, {user?.name}! 👋</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Acompanhe seu progresso e continue evoluindo.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Cursos Matriculados
                </CardTitle>
                <BookOpen className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de cursos ativos
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Cursos Concluídos
                </CardTitle>
                <Trophy className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Certificados conquistados
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Sequência
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 dias</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dias consecutivos
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* My Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Meus cursos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ProgressBar value={course.progress!} />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/curso/${course.id}`)}
                      >
                        {course.progress === 100 ? "Revisar curso" : "Continuar curso"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {enrolledCourses.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum curso matriculado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Comece sua jornada de aprendizado agora!
                </p>
                <Button onClick={() => navigate("/")}>
                  Explorar cursos
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
