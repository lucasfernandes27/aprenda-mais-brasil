# 📘 Aprenda Mais Brasil — Plataforma de Desenvolvimento Profissional

O **Aprenda Mais Brasil** é uma plataforma educacional voltada para apoiar professores e instituições na oferta de cursos complementares, ajudando estudantes a desenvolver novas habilidades, aprimorar competências e se preparar melhor para o mercado de trabalho.

## 🧠 Como funciona

O sistema funciona como um portal interno onde:

- Professores disponibilizam cursos organizados em módulos e aulas.
- Alunos podem se matricular, acompanhar o próprio progresso e obter certificados de conclusão.
- O aprendizado é acompanhado de forma estruturada, com histórico, conquistas e avaliações.

---

# 🚀 Como rodar o projeto

Antes de começar, certifique-se de ter o **Node.js (versão 18 ou superior)** instalado.

## 📥 Instalar dependências

Na pasta do projeto, execute:

```bash
npm install
```

## ▶️ Executar a aplicação

```bash
npm run dev
```

A aplicação iniciará usando **Vite** (geralmente em `http://localhost:5173`).

---

# 🎯 Objetivo Educacional da Plataforma

A plataforma foi criada para:

- Ajudar professores a oferecerem conteúdos complementares.
- Permitir que alunos desenvolvam habilidades práticas valorizadas pelo mercado.
- Criar um ambiente único para aprendizado autônomo e guiado.
- Facilitar o acompanhamento real do progresso de cada estudante.
- Fornecer certificados oficiais de cursos concluídos.

### 📚 Trilhas comuns incluem:

- Excel, Word e PowerPoint
- Produtividade e organização
- Noções digitais
- Comunicação e carreira
- Ferramentas práticas de trabalho

---

# 🧩 Principais funcionalidades

## 🔐 Autenticação (Supabase)

- Login e cadastro seguro via **Supabase Auth**.
- Somente usuários autenticados podem acessar o ambiente interno.
- Sessões persistentes.

---

## 🧑‍🏫 Área dos Cursos

Professores podem disponibilizar cursos organizados em:

- Módulos
- Aulas com vídeo (YouTube)
- Conteúdos práticos voltados à preparação profissional

Os alunos visualizam:

- Descrição completa do curso
- Nível
- Categoria
- Carga horária

---

## 📚 Matrícula e Acompanhamento

- Alunos podem se matricular em qualquer curso disponível.
- Matrículas são armazenadas no Supabase (`enrollments`).
- A **Dashboard** exibe todos os cursos em andamento.

---

## ▶️ Aprendizado com Progresso Real

Cada aula assistida é registrada no banco (`lesson_progress`).

O progresso aparece:

- Na Dashboard
- Na página do curso
- Em cada módulo

---

## 🎓 Certificados Automáticos

Ao concluir 100% do curso, um **certificado é gerado automaticamente**.

O certificado inclui:

- Nome do aluno
- Nome do curso
- Carga horária
- Data de conclusão
- Código único

---

## ⭐ Avaliação dos Cursos

- Estudantes podem avaliar cursos concluídos com notas de **1 a 5 estrelas** + comentário.
- Professores acompanham engajamento e feedback.

---

## 🏆 Conquistas

O aluno desbloqueia conquistas conforme avança:

- Primeira matrícula
- Primeiro curso concluído
- Série de aulas assistidas
- Entre outras expansões

---

## 👤 Perfil do Aluno

Edição completa do perfil com:

- Nome
- Bio
- Área profissional
- Foto (upload real via Supabase Storage)

Informações sincronizadas em:

- Navbar
- Dashboard
- Certificados

---

## 🌓 Tema Claro / Escuro

- Alternância entre tema claro e escuro.
- Preferência salva localmente.

---

# 🗄️ Integração Total com Supabase

O app utiliza o Supabase para:

| Funcionalidade    | Tabela/Serviço    |
| ----------------- | ----------------- |
| Perfil do usuário | `profiles`        |
| Cursos            | `courses`         |
| Módulos           | `course_modules`  |
| Aulas             | `lessons`         |
| Matrículas        | `enrollments`     |
| Progresso         | `lesson_progress` |
| Certificados      | `certificates`    |
| Avaliações        | `course_reviews`  |
| Avatar (foto)     | Storage           |

Toda a segurança é gerenciada por **RLS (Row-Level Security)**.

---

# 🛠️ Tecnologias utilizadas

- **React + TypeScript**
- **Vite**
- **Supabase (Auth, Database, Storage)**
- **TailwindCSS / Shadcn UI**
- **Lucide React**
- **Context API / Zustand**
- **Vite Dev Server**

---

# 📬 Contribuição

Sugestões, melhorias e correções são bem-vindas!
Abra uma _issue_ ou envie um **pull request** no repositório.

---
