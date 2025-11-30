import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Cursos from "./pages/Cursos";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import Conquistas from "./pages/Conquistas";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import Aula from "./pages/Aula";
import Certificados from "./pages/Certificados";
import VerCertificado from "./pages/VerCertificado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/cursos" element={<ProtectedRoute><Cursos /></ProtectedRoute>} />
              <Route path="/curso/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
              <Route path="/curso/:courseId/modulo/:moduleId/aula/:lessonId" element={<ProtectedRoute><Aula /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/conquistas" element={<ProtectedRoute><Conquistas /></ProtectedRoute>} />
              <Route path="/certificados" element={<ProtectedRoute><Certificados /></ProtectedRoute>} />
              <Route path="/certificado/:id" element={<ProtectedRoute><VerCertificado /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
