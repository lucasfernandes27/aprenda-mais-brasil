import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { certificatesService, Certificate } from "@/services/certificatesService";

const VerCertificado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    if (id) {
      certificatesService.getCertificate(id).then(setCertificate);
    }
  }, [id]);

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificado não encontrado</h1>
          <Button onClick={() => navigate("/certificados")}>
            Voltar para certificados
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/certificados")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-background to-muted/20">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Award className="w-10 h-10 text-primary" />
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">Certificado de Conclusão</h1>
                <p className="text-muted-foreground">Este documento certifica que</p>
              </div>

              <div className="py-6 border-y border-border">
                <h2 className="text-4xl font-bold text-primary mb-2">
                  {certificate.studentName}
                </h2>
                <p className="text-lg text-muted-foreground">
                  concluiu com êxito o curso
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">{certificate.courseName}</h3>
                <p className="text-muted-foreground">
                  Carga horária: {certificate.courseHours}
                </p>
              </div>

              <div className="pt-8 border-t border-border space-y-2">
                <p className="text-sm text-muted-foreground">
                  Data de conclusão: {certificate.completionDate}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Código de verificação: {certificate.id}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={() => window.print()}>
              Imprimir certificado
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerCertificado;
