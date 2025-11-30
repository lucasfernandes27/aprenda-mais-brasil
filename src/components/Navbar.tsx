import { BookOpen, LogOut, Moon, Sun, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduPlat
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">Cursos</Link>
                <Link to="/conquistas" className="text-muted-foreground hover:text-foreground transition-colors">Conquistas</Link>
                <Link to="/certificados" className="text-muted-foreground hover:text-foreground transition-colors">Certificados</Link>
                <Link to="/perfil" className="text-muted-foreground hover:text-foreground transition-colors">Perfil</Link>
              </>
            )}
            
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="ml-2"
                  aria-label="Alternar tema"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
