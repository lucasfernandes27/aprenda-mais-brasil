import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Achievement } from "@/data/mockData";
import { Trophy, Flame, Award, Star, Crown, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface ConquistaCardProps {
  achievement: Achievement;
}

const iconMap: Record<string, any> = {
  Trophy,
  Flame,
  Award,
  Star,
  Crown,
  Zap,
};

const ConquistaCard = ({ achievement }: ConquistaCardProps) => {
  const Icon = iconMap[achievement.icon] || Trophy;

  return (
    <motion.div
      whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`h-full ${
          achievement.unlocked
            ? "border-primary shadow-glow"
            : "opacity-60 grayscale"
        }`}
      >
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            {achievement.unlocked ? (
              <Icon className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Lock className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <span
            className={`text-sm font-medium ${
              achievement.unlocked ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {achievement.unlocked ? "Desbloqueada" : "Bloqueada"}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConquistaCard;
