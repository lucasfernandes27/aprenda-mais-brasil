import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, BarChart, CheckCircle2, ArrowLeft, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, enrollCourse } = useAuth();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para início</Button>
        </div>
      </div>
    );
  }

  const levelColors = {
    Iniciante: "bg-success text-success-foreground",
    Intermediário: "bg-secondary text-secondary-foreground",
    Avançado: "bg-destructive text-destructive-foreground",
  };

  const isEnrolled = user?.enrolledCourses.includes(id!);

  const handleEnroll = () => {
    if (id) {
      enrollCourse(id);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className={levelColors[course.level]}>
                {course.level}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart className="w-3 h-3" />
                {course.category}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {course.fullDescription}
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do curso</CardTitle>
                <CardDescription>
                  {course.modules.length} módulos neste curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium">{module.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-11 mt-2">
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id}>
                              <button
                                onClick={() => {
                                  if (isEnrolled) {
                                    navigate(`/curso/${course.id}/modulo/${module.id}/aula/${lesson.id}`);
                                  }
                                }}
                                disabled={!isEnrolled}
                                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                                  isEnrolled
                                    ? "hover:bg-muted cursor-pointer"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{lesson.title}</p>
                                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Matricule-se agora</CardTitle>
                <CardDescription>
                  Comece a aprender hoje mesmo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nível:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Módulos:</span>
                    <span className="font-medium">{course.modules.length}</span>
                  </div>
                </div>

                {!isEnrolled ? (
                  <Button className="w-full" size="lg" onClick={handleEnroll}>
                    Matricular-se neste curso
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-success p-3 bg-success/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Você está matriculado!</span>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate("/dashboard")}
                    >
                      Ir para Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
