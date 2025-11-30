import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { certificatesService, Certificate } from "@/services/certificatesService";

const Certificados = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (user) {
      certificatesService.getCertificates(user.id).then(setCertificates);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Meus Certificados</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Certificados dos cursos que você concluiu
          </p>
        </motion.div>

        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="py-16 text-center">
                <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum certificado ainda
                </h3>
                <p className="text-muted-foreground mb-6">
                  Complete seus cursos para ganhar certificados!
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Ver meus cursos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="line-clamp-2">{certificate.courseName}</CardTitle>
                    <CardDescription>Certificado #{certificate.id.slice(-8)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Concluído em {certificate.completionDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{certificate.courseHours}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/certificado/${certificate.id}`)}
                    >
                      Ver certificado
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificados;
