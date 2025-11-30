// Serviço para gerenciamento de certificados
// Preparado para integração futura com Supabase

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completionDate: string;
  courseHours: string;
}

export const certificatesService = {
  async getCertificates(userId: string): Promise<Certificate[]> {
    try {
      const certificatesData = localStorage.getItem("certificates");
      const allCertificates = certificatesData ? JSON.parse(certificatesData) : [];
      
      return allCertificates.filter((cert: Certificate) => cert.userId === userId);
    } catch (error) {
      console.error("Erro ao buscar certificados:", error);
      return [];
    }
  },

  async getCertificate(certificateId: string): Promise<Certificate | null> {
    try {
      const certificatesData = localStorage.getItem("certificates");
      const allCertificates = certificatesData ? JSON.parse(certificatesData) : [];
      
      return allCertificates.find((cert: Certificate) => cert.id === certificateId) || null;
    } catch (error) {
      console.error("Erro ao buscar certificado:", error);
      return null;
    }
  },

  async createCertificate(certificate: Omit<Certificate, "id">): Promise<Certificate | null> {
    try {
      const certificatesData = localStorage.getItem("certificates");
      const allCertificates = certificatesData ? JSON.parse(certificatesData) : [];
      
      // Verificar se já existe certificado para este curso e usuário
      const existingCertificate = allCertificates.find(
        (cert: Certificate) => cert.userId === certificate.userId && cert.courseId === certificate.courseId
      );
      
      if (existingCertificate) {
        return existingCertificate;
      }
      
      const newCertificate: Certificate = {
        ...certificate,
        id: `cert-${Date.now()}`,
      };
      
      allCertificates.push(newCertificate);
      localStorage.setItem("certificates", JSON.stringify(allCertificates));
      
      return newCertificate;
    } catch (error) {
      console.error("Erro ao criar certificado:", error);
      return null;
    }
  },
};
