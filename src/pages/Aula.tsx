import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { certificatesService } from "@/services/certificatesService";
import { toast } from "sonner";

const Aula = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const course = courses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    // Carregar lições completadas do localStorage
    const savedCompleted = localStorage.getItem(`completed_${courseId}`);
    if (savedCompleted) {
      setCompletedLessons(new Set(JSON.parse(savedCompleted)));
    }
  }, [courseId]);

  if (!course || !module || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aula não encontrada</h1>
          <Button onClick={() => navigate("/dashboard")}>Voltar para Dashboard</Button>
        </div>
      </div>
    );
  }

  // Verificar se o usuário está matriculado
  if (!user?.enrolledCourses.includes(courseId!)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso negado</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa estar matriculado neste curso para assistir às aulas.
          </p>
          <Button onClick={() => navigate(`/curso/${courseId}`)}>
            Ir para página do curso
          </Button>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  const handleMarkAsComplete = async () => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId!);
    setCompletedLessons(newCompleted);
    
    // Salvar no localStorage
    localStorage.setItem(`completed_${courseId}`, JSON.stringify([...newCompleted]));

    // Calcular progresso
    const progress = Math.round((newCompleted.size / allLessons.length) * 100);
    updateProgress(courseId!, progress);

    // Se concluiu 100%, gerar certificado
    if (progress === 100 && user) {
      const certificate = await certificatesService.createCertificate({
        userId: user.id,
        courseId: courseId!,
        courseName: course.title,
        studentName: user.name,
        completionDate: new Date().toLocaleDateString("pt-BR"),
        courseHours: course.duration,
      });

      if (certificate) {
        toast.success("Certificado gerado! 🎓", {
          description: "Confira na página de certificados",
        });
      }
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      const nextModule = course.modules.find(m => 
        m.lessons.some(l => l.id === nextLesson.id)
      );
      if (nextModule) {
        navigate(`/curso/${courseId}/modulo/${nextModule.id}/aula/${nextLesson.id}`);
      }
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      const prevModule = course.modules.find(m => 
        m.lessons.some(l => l.id === prevLesson.id)
      );
      if (prevModule) {
        navigate(`/curso/${courseId}/modulo/${prevModule.id}/aula/${prevLesson.id}`);
      }
    }
  };

  const isCompleted = completedLessons.has(lessonId!);

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/curso/${courseId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o curso
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                      <p className="text-muted-foreground">
                        {module.title} • {lesson.duration}
                      </p>
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Concluída</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {!isCompleted && (
                      <Button onClick={handleMarkAsComplete} className="flex-1">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar como concluída
                      </Button>
                    )}
                    {prevLesson && (
                      <Button variant="outline" onClick={handlePrevLesson}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Anterior
                      </Button>
                    )}
                    {nextLesson && (
                      <Button onClick={handleNextLesson}>
                        Próxima aula
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Module Lessons List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Conteúdo do módulo</CardTitle>
                <CardDescription>{module.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {module.lessons.map((l, index) => {
                    const isCurrent = l.id === lessonId;
                    const isLessonCompleted = completedLessons.has(l.id);

                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => navigate(`/curso/${courseId}/modulo/${moduleId}/aula/${l.id}`)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            isCurrent
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isCurrent
                                ? "bg-primary-foreground/20"
                                : isLessonCompleted
                                ? "bg-success/20"
                                : "bg-muted"
                            }`}>
                              {isLessonCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-success" />
                              ) : (
                                <PlayCircle className={`w-4 h-4 ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"}`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{l.title}</p>
                              <p className={`text-xs ${isCurrent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {l.duration}
                              </p>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Aula;
