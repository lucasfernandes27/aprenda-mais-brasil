import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, BarChart, CheckCircle2, ArrowLeft, PlayCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { reviewsService, Review } from "@/services/reviewsService";
import { progressService } from "@/services/progressService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import StarRating from "@/components/StarRating";
import ProgressBar from "@/components/ProgressBar";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, enrollCourse } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    if (id) {
      loadReviews();
      loadProgress();
    }
  }, [id, user]);

  const loadProgress = async () => {
    if (!id || !user || !course) return;

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    const progress = await progressService.getCourseProgress(user.id, id, totalLessons);
    setCourseProgress(progress);

    const completedIds = await progressService.getCompletedLessonIds(user.id, id);
    setCompletedLessons(new Set(completedIds));
  };

  const loadReviews = async () => {
    if (!id) return;
    
    const courseReviews = await reviewsService.getCourseReviews(id);
    setReviews(courseReviews);

    const rating = await reviewsService.getCourseAverageRating(id);
    setAverageRating(rating);

    if (user) {
      const review = await reviewsService.getUserReview(id, user.id);
      setUserReview(review);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user || !id) return;

    if (userReview) {
      // Atualizar avaliação existente
      await reviewsService.updateReview(userReview.id, rating, comment);
      toast.success("Avaliação atualizada!");
    } else {
      // Criar nova avaliação
      await reviewsService.createReview({
        courseId: id,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
      });
      toast.success("Avaliação enviada!");
    }

    setShowReviewForm(false);
    loadReviews();
  };

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
                          {module.lessons.map((lesson) => {
                            const isCurrent = false;
                            const isLessonCompleted = completedLessons.has(lesson.id);

                            return (
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
                                  {isLessonCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{lesson.title}</p>
                                    <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            {isEnrolled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Avaliações</CardTitle>
                        <CardDescription>
                          O que os alunos acharam deste curso
                        </CardDescription>
                      </div>
                      {averageRating.count > 0 && (
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-3xl font-bold">{averageRating.average}</span>
                            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {averageRating.count} {averageRating.count === 1 ? "avaliação" : "avaliações"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!showReviewForm && !userReview && (
                      <Button onClick={() => setShowReviewForm(true)} className="w-full">
                        Avaliar este curso
                      </Button>
                    )}

                    {!showReviewForm && userReview && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Sua avaliação</h4>
                          <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>
                            Editar
                          </Button>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <StarRating rating={userReview.rating} readonly />
                          {userReview.comment && (
                            <p className="text-sm mt-2">{userReview.comment}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {showReviewForm && (
                      <div className="space-y-3">
                        <ReviewForm
                          onSubmit={handleSubmitReview}
                          initialRating={userReview?.rating || 0}
                          initialComment={userReview?.comment || ""}
                          isEditing={!!userReview}
                        />
                        <Button
                          variant="ghost"
                          onClick={() => setShowReviewForm(false)}
                          className="w-full"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}

                    {reviews.length > 0 && (
                      <div className="pt-6 border-t">
                        <h4 className="font-medium mb-4">Todas as avaliações</h4>
                        <ReviewList reviews={reviews} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
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
                    {courseProgress > 0 && (
                      <ProgressBar value={courseProgress} />
                    )}
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
