import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart } from "lucide-react";
import { Course } from "@/data/mockData";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  const levelColors = {
    Iniciante: "bg-success text-success-foreground",
    Intermediário: "bg-secondary text-secondary-foreground",
    Avançado: "bg-destructive text-destructive-foreground",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-border">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge className={levelColors[course.level]}>
              {course.level}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </Badge>
          </div>
          <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
          <CardDescription className="text-sm">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <BarChart className="w-4 h-4" />
            <span>{course.category}</span>
          </div>
          <Button 
            className="w-full"
            onClick={() => navigate(`/curso/${course.id}`)}
          >
            Ver detalhes
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
