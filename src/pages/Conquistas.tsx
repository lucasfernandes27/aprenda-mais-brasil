import { achievements } from "@/data/mockData";
import ConquistaCard from "@/components/ConquistaCard";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

const Conquistas = () => {
  // Simulate some unlocked achievements
  const updatedAchievements = achievements.map((achievement, index) => ({
    ...achievement,
    unlocked: index < 2, // First 2 are unlocked
  }));

  const unlockedCount = updatedAchievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Suas conquistas</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Celebre cada passo da sua jornada de aprendizado.
          </p>

          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-4">
                <Trophy className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <div className="text-3xl font-bold">
                    {unlockedCount}/{achievements.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conquistas desbloqueadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {updatedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <ConquistaCard achievement={achievement} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Conquistas;
