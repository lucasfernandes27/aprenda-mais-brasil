export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  modules: string[];
  enrolled?: boolean;
  progress?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Excel para Iniciantes",
    description: "Aprenda o básico do Excel: formatação, fórmulas simples e organização de dados.",
    fullDescription: "Neste curso você aprenderá desde o básico do Excel, incluindo navegação pela interface, formatação de células, criação de fórmulas básicas e organização de dados em planilhas. Perfeito para quem está começando.",
    category: "Pacote Office",
    level: "Iniciante",
    duration: "8 horas",
    modules: [
      "Introdução ao Excel",
      "Formatação de células",
      "Fórmulas básicas (SOMA, MÉDIA)",
      "Organização de dados",
      "Gráficos simples"
    ]
  },
  {
    id: "2",
    title: "Excel Avançado para Análise de Dados",
    description: "Domine fórmulas avançadas, tabelas dinâmicas e análise de grandes volumes de dados.",
    fullDescription: "Aprenda técnicas avançadas de Excel para análise profissional de dados. Inclui PROCV, PROCX, tabelas dinâmicas, formatação condicional avançada e muito mais.",
    category: "Pacote Office",
    level: "Avançado",
    duration: "16 horas",
    modules: [
      "Fórmulas avançadas (PROCV, PROCX, SE)",
      "Tabelas dinâmicas",
      "Formatação condicional avançada",
      "Análise de dados",
      "Power Query básico"
    ]
  },
  {
    id: "3",
    title: "Word Essencial para o Dia a Dia",
    description: "Crie documentos profissionais com formatação adequada e recursos avançados do Word.",
    fullDescription: "Domine o Word para criar documentos profissionais. Aprenda sobre estilos, formatação, índices automáticos e muito mais.",
    category: "Pacote Office",
    level: "Intermediário",
    duration: "6 horas",
    modules: [
      "Interface do Word",
      "Formatação de texto",
      "Estilos e temas",
      "Índices automáticos",
      "Mala direta"
    ]
  },
  {
    id: "4",
    title: "Apresentações Profissionais com PowerPoint",
    description: "Crie apresentações impactantes com design moderno e storytelling eficaz.",
    fullDescription: "Aprenda a criar apresentações que prendem a atenção. Desde design de slides até técnicas de apresentação e storytelling visual.",
    category: "Pacote Office",
    level: "Intermediário",
    duration: "10 horas",
    modules: [
      "Princípios de design",
      "Criação de slides impactantes",
      "Animações e transições",
      "Storytelling visual",
      "Apresentação eficaz"
    ]
  },
  {
    id: "5",
    title: "Produtividade com Google Workspace",
    description: "Maximize sua produtividade com Gmail, Google Drive, Docs e Sheets.",
    fullDescription: "Aprenda a usar as ferramentas do Google Workspace de forma profissional para aumentar sua produtividade no trabalho.",
    category: "Produtividade",
    level: "Iniciante",
    duration: "8 horas",
    modules: [
      "Gmail avançado",
      "Google Drive e organização",
      "Google Docs",
      "Google Sheets",
      "Colaboração em tempo real"
    ]
  },
  {
    id: "6",
    title: "Gestão de Tempo e Organização Pessoal",
    description: "Técnicas comprovadas para gerenciar seu tempo e aumentar sua produtividade.",
    fullDescription: "Descubra métodos práticos para organizar suas tarefas, gerenciar projetos pessoais e profissionais, e alcançar seus objetivos.",
    category: "Produtividade",
    level: "Iniciante",
    duration: "5 horas",
    modules: [
      "Método Pomodoro",
      "GTD - Getting Things Done",
      "Ferramentas de produtividade",
      "Planejamento semanal",
      "Hábitos produtivos"
    ]
  }
];

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Primeiro Passo",
    description: "Matriculou-se no primeiro curso",
    icon: "Trophy",
    unlocked: false
  },
  {
    id: "2",
    title: "Estudante Dedicado",
    description: "Complete 5 dias seguidos de estudo",
    icon: "Flame",
    unlocked: false
  },
  {
    id: "3",
    title: "Conquistador",
    description: "Concluiu o primeiro curso",
    icon: "Award",
    unlocked: false
  },
  {
    id: "4",
    title: "Expert em Excel",
    description: "Complete todos os cursos de Excel",
    icon: "Star",
    unlocked: false
  },
  {
    id: "5",
    title: "Mestre do Office",
    description: "Complete todos os cursos do Pacote Office",
    icon: "Crown",
    unlocked: false
  },
  {
    id: "6",
    title: "Maratonista",
    description: "Complete 10 horas de estudo em uma semana",
    icon: "Zap",
    unlocked: false
  }
];
