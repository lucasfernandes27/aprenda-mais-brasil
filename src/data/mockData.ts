export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  modules: Module[];
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
      {
        id: "1-1",
        title: "Introdução ao Excel",
        lessons: [
          {
            id: "1-1-1",
            title: "Interface e primeiros passos",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "15 min"
          },
          {
            id: "1-1-2",
            title: "Navegação básica",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "12 min"
          }
        ]
      },
      {
        id: "1-2",
        title: "Formatação de células",
        lessons: [
          {
            id: "1-2-1",
            title: "Formatação básica",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "18 min"
          }
        ]
      },
      {
        id: "1-3",
        title: "Fórmulas básicas (SOMA, MÉDIA)",
        lessons: [
          {
            id: "1-3-1",
            title: "Função SOMA",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "20 min"
          },
          {
            id: "1-3-2",
            title: "Função MÉDIA",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "15 min"
          }
        ]
      },
      {
        id: "1-4",
        title: "Organização de dados",
        lessons: [
          {
            id: "1-4-1",
            title: "Ordenação e filtros",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "22 min"
          }
        ]
      },
      {
        id: "1-5",
        title: "Gráficos simples",
        lessons: [
          {
            id: "1-5-1",
            title: "Criando seu primeiro gráfico",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "25 min"
          }
        ]
      }
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
      {
        id: "2-1",
        title: "Fórmulas avançadas (PROCV, PROCX, SE)",
        lessons: [
          {
            id: "2-1-1",
            title: "Função PROCV detalhada",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "30 min"
          },
          {
            id: "2-1-2",
            title: "Função PROCX e suas vantagens",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "28 min"
          },
          {
            id: "2-1-3",
            title: "Função SE aninhada",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "25 min"
          }
        ]
      },
      {
        id: "2-2",
        title: "Tabelas dinâmicas",
        lessons: [
          {
            id: "2-2-1",
            title: "Criando tabelas dinâmicas",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "35 min"
          },
          {
            id: "2-2-2",
            title: "Gráficos dinâmicos",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "30 min"
          }
        ]
      },
      {
        id: "2-3",
        title: "Formatação condicional avançada",
        lessons: [
          {
            id: "2-3-1",
            title: "Regras de formatação",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "20 min"
          }
        ]
      },
      {
        id: "2-4",
        title: "Análise de dados",
        lessons: [
          {
            id: "2-4-1",
            title: "Ferramentas de análise",
            videoUrl: "https://www.youtube.com/embed/I6S5xQ8G3Hc",
            duration: "40 min"
          }
        ]
      },
      {
        id: "2-5",
        title: "Power Query básico",
        lessons: [
          {
            id: "2-5-1",
            title: "Introdução ao Power Query",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "45 min"
          }
        ]
      }
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
      {
        id: "3-1",
        title: "Interface do Word",
        lessons: [
          {
            id: "3-1-1",
            title: "Conhecendo o Word",
            videoUrl: "https://www.youtube.com/embed/GGTJ0fQ0yKg",
            duration: "15 min"
          }
        ]
      },
      {
        id: "3-2",
        title: "Formatação de texto",
        lessons: [
          {
            id: "3-2-1",
            title: "Formatação básica de texto",
            videoUrl: "https://www.youtube.com/embed/GGTJ0fQ0yKg",
            duration: "20 min"
          },
          {
            id: "3-2-2",
            title: "Parágrafos e espaçamento",
            videoUrl: "https://www.youtube.com/embed/GGTJ0fQ0yKg",
            duration: "18 min"
          }
        ]
      },
      {
        id: "3-3",
        title: "Estilos e temas",
        lessons: [
          {
            id: "3-3-1",
            title: "Aplicando estilos",
            videoUrl: "https://www.youtube.com/embed/GGTJ0fQ0yKg",
            duration: "25 min"
          }
        ]
      },
      {
        id: "3-4",
        title: "Índices automáticos",
        lessons: [
          {
            id: "3-4-1",
            title: "Criando sumários automáticos",
            videoUrl: "https://www.youtube.com/embed/GGTJ0fQ0yKg",
            duration: "30 min"
          }
        ]
      },
      {
        id: "3-5",
        title: "Mala direta",
        lessons: [
          {
            id: "3-5-1",
            title: "Configurando mala direta",
            videoUrl: "https://www.youtube.com/embed/GGTJ0fQ0yKg",
            duration: "35 min"
          }
        ]
      }
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
      {
        id: "4-1",
        title: "Princípios de design",
        lessons: [
          {
            id: "4-1-1",
            title: "Design básico de slides",
            videoUrl: "https://www.youtube.com/embed/2KC2EefQ5-A",
            duration: "25 min"
          },
          {
            id: "4-1-2",
            title: "Cores e tipografia",
            videoUrl: "https://www.youtube.com/embed/2KC2EefQ5-A",
            duration: "20 min"
          }
        ]
      },
      {
        id: "4-2",
        title: "Criação de slides impactantes",
        lessons: [
          {
            id: "4-2-1",
            title: "Layouts eficazes",
            videoUrl: "https://www.youtube.com/embed/2KC2EefQ5-A",
            duration: "30 min"
          }
        ]
      },
      {
        id: "4-3",
        title: "Animações e transições",
        lessons: [
          {
            id: "4-3-1",
            title: "Usando animações",
            videoUrl: "https://www.youtube.com/embed/2KC2EefQ5-A",
            duration: "28 min"
          }
        ]
      },
      {
        id: "4-4",
        title: "Storytelling visual",
        lessons: [
          {
            id: "4-4-1",
            title: "Contando histórias com slides",
            videoUrl: "https://www.youtube.com/embed/2KC2EefQ5-A",
            duration: "35 min"
          }
        ]
      },
      {
        id: "4-5",
        title: "Apresentação eficaz",
        lessons: [
          {
            id: "4-5-1",
            title: "Técnicas de apresentação",
            videoUrl: "https://www.youtube.com/embed/2KC2EefQ5-A",
            duration: "40 min"
          }
        ]
      }
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
      {
        id: "5-1",
        title: "Gmail avançado",
        lessons: [
          {
            id: "5-1-1",
            title: "Organizando seu Gmail",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "20 min"
          }
        ]
      },
      {
        id: "5-2",
        title: "Google Drive e organização",
        lessons: [
          {
            id: "5-2-1",
            title: "Estruturando seu Drive",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "25 min"
          }
        ]
      },
      {
        id: "5-3",
        title: "Google Docs",
        lessons: [
          {
            id: "5-3-1",
            title: "Criando documentos",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "22 min"
          }
        ]
      },
      {
        id: "5-4",
        title: "Google Sheets",
        lessons: [
          {
            id: "5-4-1",
            title: "Planilhas no Google Sheets",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "30 min"
          }
        ]
      },
      {
        id: "5-5",
        title: "Colaboração em tempo real",
        lessons: [
          {
            id: "5-5-1",
            title: "Trabalhando em equipe",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "28 min"
          }
        ]
      }
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
      {
        id: "6-1",
        title: "Método Pomodoro",
        lessons: [
          {
            id: "6-1-1",
            title: "Introdução ao Pomodoro",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "18 min"
          }
        ]
      },
      {
        id: "6-2",
        title: "GTD - Getting Things Done",
        lessons: [
          {
            id: "6-2-1",
            title: "Conceitos do GTD",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "25 min"
          }
        ]
      },
      {
        id: "6-3",
        title: "Ferramentas de produtividade",
        lessons: [
          {
            id: "6-3-1",
            title: "Apps para produtividade",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "22 min"
          }
        ]
      },
      {
        id: "6-4",
        title: "Planejamento semanal",
        lessons: [
          {
            id: "6-4-1",
            title: "Organizando sua semana",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "20 min"
          }
        ]
      },
      {
        id: "6-5",
        title: "Hábitos produtivos",
        lessons: [
          {
            id: "6-5-1",
            title: "Criando hábitos eficazes",
            videoUrl: "https://www.youtube.com/embed/3u3W5JY5cXQ",
            duration: "30 min"
          }
        ]
      }
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
