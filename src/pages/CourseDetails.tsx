import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);

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

  const handleEnroll = () => {
    setEnrolled(true);
    toast.success("Matrícula realizada com sucesso!", {
      description: "Você já pode começar seus estudos.",
    });
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
                <ul className="space-y-3">
                  {course.modules.map((module, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-foreground">{module}</span>
                    </motion.li>
                  ))}
                </ul>
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

                {!enrolled ? (
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
