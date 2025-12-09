# 📘 Aprenda Mais Brasil — Plataforma de Desenvolvimento Profissional

O **Aprenda Mais Brasil** é uma plataforma educacional voltada para apoiar professores e instituições na oferta de cursos complementares, ajudando estudantes a desenvolver novas habilidades, aprimorar competências e se preparar melhor para o mercado de trabalho.

## 🧠 Como funciona

O sistema funciona como um portal interno onde:

- Professores disponibilizam cursos organizados em módulos e aulas.
- Alunos podem se matricular, acompanhar o próprio progresso e obter certificados de conclusão.
- O aprendizado é acompanhado de forma estruturada, com histórico, conquistas e avaliações.

---

# 🚀 Como rodar o projeto

# 🚀 Aprenda Mais Brasil - Guia Completo de Deploy

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Setup Local com Docker](#setup-local-com-docker)
- [Deploy na Azure](#deploy-na-azure)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este projeto é uma aplicação React + Vite com infraestrutura completa de monitoramento usando:
- **Frontend:** React + Vite servido por Nginx
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Monitoramento:** Zabbix + Grafana
- **Container:** Docker + Docker Compose
- **Cloud:** Azure Container Instances / App Service

---

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                         AZURE CLOUD                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Azure Container Registry (ACR)             │  │
│  │  • Armazena imagens Docker                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        Azure Container Instances / App Service        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Container: aprenda-mais-app (Porta 3000)       │  │  │
│  │  │  • React App buildada com Vite                  │  │  │
│  │  │  • Servida por Nginx                            │  │  │
│  │  │  • Conecta ao Supabase                          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Container: zabbix-server (Porta 10051)         │  │  │
│  │  │  • Coleta e processa métricas                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Container: zabbix-web (Porta 8080)             │  │  │
│  │  │  • Interface de monitoramento                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Container: grafana (Porta 3001)                │  │  │
│  │  │  • Dashboards e visualizações                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Azure Database for PostgreSQL                  │  │  │
│  │  │  • Banco do Zabbix (produção)                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   Supabase Cloud  │
                    │  • PostgreSQL     │
                    │  • Auth           │
                    │  • Storage        │
                    └───────────────────┘
```

---

## ✅ Pré-requisitos

### Ferramentas Necessárias
```bash
# Verificar instalações
node --version    # v18 ou superior
npm --version     # v9 ou superior
docker --version  # v24 ou superior
docker-compose --version  # v2.0 ou superior
az --version      # Azure CLI v2.50 ou superior
```

### Instalar Ferramentas

**Docker Desktop (Windows/Mac):**
```bash
# Download: https://www.docker.com/products/docker-desktop
```

**Azure CLI:**
```bash
# Windows (PowerShell como Admin):
winget install Microsoft.AzureCLI

# macOS:
brew install azure-cli

# Linux:
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

---

## 🐳 Setup Local com Docker

### Passo 1: Clonar e Configurar Variáveis

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/aprenda-mais-brasil.git
cd aprenda-mais-brasil

# Criar arquivo .env (copie as credenciais do Supabase)
cat > .env << EOF
VITE_SUPABASE_PROJECT_ID="ciozofnbegqusnyexqmn"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGci..."
VITE_SUPABASE_URL="https://ciozofnbegqusnyexqmn.supabase.co"
EOF
```

**⚠️ Importante:** Nunca commite o arquivo `.env` no Git!

### Passo 2: Criar Configuração do Nginx

```bash
# Criar arquivo nginx.conf
cat > nginx.conf << 'EOF'
server {
    # Escuta requisições HTTP na porta 80
    listen 80;
    
    # Define o nome do servidor (localhost para desenvolvimento)
    server_name localhost;
    
    # Diretório raiz onde estão os arquivos buildados
    root /usr/share/nginx/html;
    
    # Arquivo padrão a ser servido
    index index.html;
    
    # Configuração para Single Page Application (SPA)
    # Todas as rotas são redirecionadas para index.html
    # Isso permite que o React Router funcione corretamente
    location / {
        # Tenta servir o arquivo solicitado ($uri)
        # Se não existir, tenta como diretório ($uri/)
        # Se ainda assim falhar, serve o index.html
        try_files $uri $uri/ /index.html;
    }
    
    # Configuração de cache para assets estáticos
    # Aplica-se a arquivos JS, CSS, imagens, etc.
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        # Cache por 1 ano (máximo recomendado)
        expires 1y;
        
        # Adiciona header de controle de cache
        # "public" = pode ser cacheado por CDNs
        # "immutable" = arquivo nunca muda (requer novo nome para atualizar)
        add_header Cache-Control "public, immutable";
    }
    
    # Compressão gzip para melhor performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
EOF
```

### Passo 3: Entender o Dockerfile

O Dockerfile usa **multi-stage build** para otimizar o tamanho final:

```dockerfile
# ========================================
# ESTÁGIO 1: BUILD DA APLICAÇÃO
# ========================================
# Usa imagem Node.js Alpine (versão leve ~40MB vs ~900MB da versão normal)
FROM node:18-alpine as builder

# Define diretório de trabalho dentro do container
WORKDIR /app

# OTIMIZAÇÃO: Copia apenas arquivos de dependências primeiro
# Se package.json não mudar, Docker reutiliza cache desta camada
COPY package*.json ./

# npm ci = Clean Install
# Mais rápido e determinístico que npm install
# Usa package-lock.json para garantir versões exatas
RUN npm ci

# Agora copia todo o código fonte
COPY . .

# Declara argumentos de build (recebidos do docker-compose)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID

# Converte argumentos em variáveis de ambiente
# Necessário porque Vite só lê variáveis de ambiente em build time
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

# Executa o build do Vite
# Gera arquivos otimizados em /app/dist
RUN npm run build

# ========================================
# ESTÁGIO 2: SERVIDOR DE PRODUÇÃO
# ========================================
# Nova imagem leve apenas com Nginx (~20MB)
FROM nginx:alpine

# Copia APENAS os arquivos buildados do estágio anterior
# --from=builder = referência ao estágio 1
# Resultado: imagem final ~25MB vs ~400MB se incluísse Node
COPY --from=builder /app/dist /usr/share/nginx/html

# Substitui configuração padrão do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Documenta que o container expõe porta 80
EXPOSE 80

# Comando para manter Nginx rodando
# -g daemon off = executa em foreground (necessário para containers)
CMD ["nginx", "-g", "daemon off;"]
```

### Passo 4: Entender o Docker Compose

```bash
# Ver todos os serviços definidos
docker-compose config

# Explicação de cada serviço:
```

**Serviço: app (Sua aplicação React)**
```yaml
app:
  build:
    context: .              # Usa diretório atual
    dockerfile: Dockerfile  # Arquivo de build
    args:                   # Passa secrets como argumentos
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
  container_name: aprenda-mais-app
  ports:
    - "3000:80"  # Host:Container (acessa via localhost:3000)
  networks:
    - monitoring  # Conecta à rede interna
  restart: unless-stopped  # Reinicia sempre, exceto parada manual
```

**Serviço: postgres-zabbix (Banco de dados)**
```yaml
postgres-zabbix:
  image: postgres:15-alpine  # Imagem pronta do Docker Hub
  environment:
    POSTGRES_USER: zabbix
    POSTGRES_PASSWORD: zabbix_pwd
    POSTGRES_DB: zabbix
  volumes:
    - postgres-data:/var/lib/postgresql/data  # Persistência
  # Volume nomeado = dados sobrevivem mesmo se container for deletado
```

**Serviço: zabbix-server (Motor de monitoramento)**
```yaml
zabbix-server:
  environment:
    DB_SERVER_HOST: postgres-zabbix  # DNS interno do Docker
  depends_on:
    - postgres-zabbix  # Espera banco iniciar primeiro
  ports:
    - "10051:10051"  # Porta para agentes enviarem dados
```

**Serviço: zabbix-agent (Coletor de métricas)**
```yaml
zabbix-agent:
  privileged: true  # Acesso elevado ao sistema
  pid: host         # Compartilha namespace de processos com host
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro  # Monitora containers
    - /proc:/host/proc:ro   # CPU, memória, processos
    - /sys:/host/sys:ro     # Hardware, temperatura
    - /:/rootfs:ro          # Sistema de arquivos
  # :ro = read-only (segurança)
```

### Passo 5: Subir Ambiente Local

```bash
# Build de todas as imagens (primeira vez ~5-10 minutos)
docker-compose build

# Subir todos os containers em modo detached (background)
docker-compose up -d

# Aguardar containers iniciarem (verificar status)
docker-compose ps

# Acompanhar logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f app
```

### Passo 6: Acessar Aplicações

```bash
# Aplicação React
http://localhost:3000

# Zabbix (usuário: Admin / senha: zabbix)
http://localhost:8080

# Grafana (usuário: admin / senha: admin123)
http://localhost:3001
```

### Passo 7: Gerenciar Containers

```bash
# Ver status de todos os containers
docker-compose ps

# Ver uso de recursos (CPU, memória)
docker stats

# Parar todos os containers (dados persistem)
docker-compose stop

# Iniciar containers parados
docker-compose start

# Reiniciar um serviço específico
docker-compose restart app

# Parar e remover containers (dados em volumes persistem)
docker-compose down

# Parar e DELETAR TUDO (incluindo volumes)
docker-compose down -v

# Reconstruir e restartar um serviço
docker-compose up -d --build app

# Ver logs dos últimos 100 linhas
docker-compose logs --tail=100

# Executar comando dentro de um container
docker-compose exec app sh
docker-compose exec postgres-zabbix psql -U zabbix
```

---

## ☁️ Deploy na Azure

### Opção 1: Azure Container Instances (Mais Simples)

#### Passo 1: Login e Preparação

```bash
# Login na Azure
az login

# Criar grupo de recursos
az group create \
  --name aprenda-mais-rg \
  --location brazilsouth

# Criar Azure Container Registry (ACR)
az acr create \
  --resource-group aprenda-mais-rg \
  --name aprendamaisacr \
  --sku Basic

# Habilitar admin no ACR
az acr update \
  --name aprendamaisacr \
  --admin-enabled true

# Obter credenciais do ACR
az acr credential show \
  --name aprendamaisacr
```

#### Passo 2: Build e Push da Imagem

```bash
# Login no ACR
az acr login --name aprendamaisacr

# Build da imagem local
docker build \
  --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="${VITE_SUPABASE_PUBLISHABLE_KEY}" \
  --build-arg VITE_SUPABASE_PROJECT_ID="${VITE_SUPABASE_PROJECT_ID}" \
  -t aprendamaisacr.azurecr.io/aprenda-mais-app:latest .

# Push para ACR
docker push aprendamaisacr.azurecr.io/aprenda-mais-app:latest

# Verificar imagem no ACR
az acr repository list --name aprendamaisacr --output table
```

#### Passo 3: Deploy do Container

```bash
# Obter senha do ACR
ACR_PASSWORD=$(az acr credential show \
  --name aprendamaisacr \
  --query "passwords[0].value" -o tsv)

# Criar Container Instance (aplicação)
az container create \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app \
  --image aprendamaisacr.azurecr.io/aprenda-mais-app:latest \
  --registry-login-server aprendamaisacr.azurecr.io \
  --registry-username aprendamaisacr \
  --registry-password $ACR_PASSWORD \
  --dns-name-label aprenda-mais-app \
  --ports 80 \
  --cpu 1 \
  --memory 1

# Ver status
az container show \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app \
  --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" \
  --output table

# Acessar aplicação
echo "http://aprenda-mais-app.brazilsouth.azurecontainer.io"
```

#### Passo 4: Deploy do Monitoramento

```bash
# Criar Azure Database for PostgreSQL (produção)
az postgres flexible-server create \
  --resource-group aprenda-mais-rg \
  --name aprendamais-postgres \
  --location brazilsouth \
  --admin-user zabbix \
  --admin-password "SuaSenhaSegura123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32

# Criar banco do Zabbix
az postgres flexible-server db create \
  --resource-group aprenda-mais-rg \
  --server-name aprendamais-postgres \
  --database-name zabbix

# Deploy do Zabbix Server
az container create \
  --resource-group aprenda-mais-rg \
  --name zabbix-server \
  --image zabbix/zabbix-server-pgsql:alpine-6.4-latest \
  --ports 10051 \
  --cpu 1 \
  --memory 1 \
  --environment-variables \
    DB_SERVER_HOST=aprendamais-postgres.postgres.database.azure.com \
    POSTGRES_USER=zabbix \
    POSTGRES_PASSWORD=SuaSenhaSegura123! \
    POSTGRES_DB=zabbix

# Deploy do Zabbix Web
az container create \
  --resource-group aprenda-mais-rg \
  --name zabbix-web \
  --image zabbix/zabbix-web-nginx-pgsql:alpine-6.4-latest \
  --dns-name-label aprenda-mais-zabbix \
  --ports 8080 \
  --cpu 1 \
  --memory 1 \
  --environment-variables \
    DB_SERVER_HOST=aprendamais-postgres.postgres.database.azure.com \
    POSTGRES_USER=zabbix \
    POSTGRES_PASSWORD=SuaSenhaSegura123! \
    POSTGRES_DB=zabbix \
    ZBX_SERVER_HOST=zabbix-server \
    PHP_TZ=America/Sao_Paulo

# Deploy do Grafana
az container create \
  --resource-group aprenda-mais-rg \
  --name grafana \
  --image grafana/grafana:latest \
  --dns-name-label aprenda-mais-grafana \
  --ports 3000 \
  --cpu 1 \
  --memory 1 \
  --environment-variables \
    GF_SECURITY_ADMIN_USER=admin \
    GF_SECURITY_ADMIN_PASSWORD=admin123
```

### Opção 2: Azure App Service (Gerenciado)

```bash
# Criar App Service Plan
az appservice plan create \
  --name aprenda-mais-plan \
  --resource-group aprenda-mais-rg \
  --is-linux \
  --sku B1

# Criar Web App
az webapp create \
  --resource-group aprenda-mais-rg \
  --plan aprenda-mais-plan \
  --name aprenda-mais-web \
  --deployment-container-image-name aprendamaisacr.azurecr.io/aprenda-mais-app:latest

# Configurar credenciais do ACR
az webapp config container set \
  --name aprenda-mais-web \
  --resource-group aprenda-mais-rg \
  --docker-custom-image-name aprendamaisacr.azurecr.io/aprenda-mais-app:latest \
  --docker-registry-server-url https://aprendamaisacr.azurecr.io \
  --docker-registry-server-user aprendamaisacr \
  --docker-registry-server-password $ACR_PASSWORD

# Habilitar logs
az webapp log config \
  --name aprenda-mais-web \
  --resource-group aprenda-mais-rg \
  --docker-container-logging filesystem

# Ver logs em tempo real
az webapp log tail \
  --name aprenda-mais-web \
  --resource-group aprenda-mais-rg
```

### Opção 3: Azure Kubernetes Service (Produção Enterprise)

```bash
# Criar cluster AKS
az aks create \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-aks \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --attach-acr aprendamaisacr \
  --generate-ssh-keys

# Conectar ao cluster
az aks get-credentials \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-aks

# Criar namespace
kubectl create namespace aprenda-mais

# Deploy usando kubectl (criar arquivo k8s-deployment.yaml)
kubectl apply -f k8s-deployment.yaml -n aprenda-mais

# Ver status
kubectl get all -n aprenda-mais
```

---

## 📊 Configurar Monitoramento

### Configurar Zabbix

```bash
# 1. Acessar Zabbix Web Interface
http://aprenda-mais-zabbix.brazilsouth.azurecontainer.io:8080

# Credenciais padrão:
# Usuário: Admin
# Senha: zabbix

# 2. Adicionar Host para monitorar aplicação
Configuration → Hosts → Create Host
  Host name: Aprenda Mais App
  Groups: Applications
  Interfaces: 
    - Type: Agent
    - IP: [IP do container app]
    - Port: 10050

# 3. Adicionar Templates
  Templates → Link template → Template App HTTP Service

# 4. Configurar Triggers (alertas)
Configuration → Hosts → [seu host] → Triggers → Create trigger
  Name: Site não responde
  Expression: {Aprenda Mais App:web.page.get[].last()}=0
  Severity: High
```

### Configurar Grafana

```bash
# 1. Acessar Grafana
http://aprenda-mais-grafana.brazilsouth.azurecontainer.io:3000

# Credenciais padrão:
# Usuário: admin
# Senha: admin123

# 2. Adicionar Data Source
Configuration → Data Sources → Add data source
  Type: Zabbix
  URL: http://zabbix-web:8080/api_jsonrpc.php
  Username: Admin
  Password: zabbix

# 3. Importar Dashboard Pronto
Dashboards → Import
  Dashboard ID: 1860 (Node Exporter Full)
  ou
  Dashboard ID: 12740 (Zabbix Server)

# 4. Criar Dashboard Customizado
+ → Dashboard → Add new panel
  Query: 
    - Métricas: CPU, memória, requests/s
    - Visualizações: Graph, Gauge, Stat
```

---

## 🔍 Troubleshooting

### Problemas Comuns - Docker Local

**Container não inicia:**
```bash
# Ver logs detalhados
docker-compose logs app

# Erro comum: variáveis de ambiente
# Solução: verificar .env
cat .env

# Rebuild forçado
docker-compose build --no-cache app
docker-compose up -d app
```

**Porta já em uso:**
```bash
# Identificar processo usando porta 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Mudar porta no docker-compose.yml
ports:
  - "3001:80"  # Usa 3001 ao invés de 3000
```

**Problema de permissão (Linux):**
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Aplicar mudanças
newgrp docker

# Testar
docker ps
```

### Problemas Comuns - Azure

**Push para ACR falha:**
```bash
# Verificar login
az acr login --name aprendamaisacr

# Verificar credenciais
az acr credential show --name aprendamaisacr

# Tentar push manual com credenciais
docker login aprendamaisacr.azurecr.io \
  -u aprendamaisacr \
  -p [senha do comando acima]
```

**Container não inicia na Azure:**
```bash
# Ver logs
az container logs \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app

# Ver eventos
az container show \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app \
  --query "containers[0].instanceView.events"

# Problema comum: falta de memória
# Solução: aumentar recursos
az container create ... --memory 2
```

**Site não carrega (erro 502):**
```bash
# Verificar health
az container show \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app \
  --query "containers[0].instanceView.currentState"

# Verificar se container está rodando
az container exec \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app \
  --exec-command "curl localhost"

# Reiniciar container
az container restart \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app
```

### Comandos Úteis Azure

```bash
# Ver todos os recursos do grupo
az resource list \
  --resource-group aprenda-mais-rg \
  --output table

# Ver custos estimados
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-12-31

# Deletar recurso específico
az container delete \
  --resource-group aprenda-mais-rg \
  --name aprenda-mais-app \
  --yes

# Deletar TUDO (cuidado!)
az group delete \
  --name aprenda-mais-rg \
  --yes --no-wait
```

---

## 📚 Referências

- [Docker Docs](https://docs.docker.com/)
- [Azure Container Instances](https://learn.microsoft.com/azure/container-instances/)
- [Zabbix Documentation](https://www.zabbix.com/documentation)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

## 🤝 Suporte

- Issues: [GitHub Issues](https://github.com/seu-usuario/aprenda-mais-brasil/issues)
- Email: suporte@aprendamais.com.br
- Discord: [Servidor da Comunidade]

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.