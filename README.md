# CodeOdyssey

![CodeOdyssey Banner](https://via.placeholder.com/800x200.png?text=CodeOdyssey)

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
  - [Frontend (React + TypeScript + Vite)](#frontend-react--typescript--vite)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Banco de Dados (MongoDB)](#banco-de-dados-mongodb)
- [Configuração de Desenvolvimento](#configuração-de-desenvolvimento)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração do Frontend](#configuração-do-frontend)
  - [Configuração do Backend](#configuração-do-backend)
  - [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Implantação (Deploy)](#implantação-deploy)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Backend (Render)](#backend-render)
  - [Banco de Dados (MongoDB Atlas)](#banco-de-dados-mongodb-atlas)
- [CI/CD](#cicd)
- [Testes](#testes)
- [Segurança](#segurança)
- [Escalabilidade](#escalabilidade)
- [Monitoramento](#monitoramento)
- [Contribuição](#contribuição)
- [Planejamento de Versões](#planejamento-de-versões)
- [Licença](#licença)

## Visão Geral

CodeOdyssey é uma plataforma de gerenciamento de aprendizado especializada em cursos de programação. O sistema oferece um ambiente de codificação interativo, gestão completa de cursos, acompanhamento de progresso, fóruns de discussão e certificação, proporcionando uma experiência de aprendizado imersiva e eficaz para estudantes de programação em diferentes níveis.

### Objetivos

- Criar um ambiente interativo para aprendizado de programação
- Oferecer suporte para múltiplas linguagens de programação
- Proporcionar feedback automático para exercícios
- Facilitar a interação entre alunos e instrutores
- Fornecer análises detalhadas sobre o progresso dos estudantes

## Arquitetura do Sistema

O LMS utiliza uma arquitetura em camadas, com frontend em React, backend em Spring Boot e banco de dados MongoDB.

### Diagrama de Arquitetura

```
┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
│       Frontend        │      │        Backend        │      │     Banco de Dados    │
│                       │      │                       │      │                       │
│  ┌─────────────────┐  │      │  ┌─────────────────┐  │      │  ┌─────────────────┐  │
│  │ Componentes React  │      │  │  Controllers    │  │      │  │  Collections    │  │
│  │                 │  │      │  │                 │  │      │  │                 │  │
│  │ - Pages         │  │      │  │ - AuthController│  │      │  │ - users         │  │
│  │ - Components    │◄─┼──────┼─►│ - CourseController│◄┼──────┼─►│ - courses       │  │
│  │ - Containers    │  │      │  │ - UserController│  │      │  │ - progress      │  │
│  │                 │  │      │  │                 │  │      │  │ - exercises     │  │
│  └─────────────────┘  │      │  └─────────────────┘  │      │  │ - discussions   │  │
│                       │      │                       │      │  │ - notifications  │  │
│  ┌─────────────────┐  │      │  ┌─────────────────┐  │      │  └─────────────────┘  │
│  │ State Management │  │      │  │    Services     │  │      │                       │
│  │                 │  │      │  │                 │  │      │  ┌─────────────────┐  │
│  │ - Redux Store   │  │      │  │ - AuthService   │  │      │  │    Indexing     │  │
│  │ - Actions       │  │      │  │ - CourseService │  │      │  │                 │  │
│  │ - Reducers      │  │      │  │ - UserService   │  │      │  │ - B-tree indexes│  │
│  │                 │  │      │  │                 │  │      │  │ - Text indexes  │  │
│  └─────────────────┘  │      │  └─────────────────┘  │      │  │                 │  │
│                       │      │                       │      │  └─────────────────┘  │
│  ┌─────────────────┐  │      │  ┌─────────────────┐  │      │                       │
│  │ Monaco Editor   │  │      │  │   Repositories  │  │      │  ┌─────────────────┐  │
│  │ Integration     │  │      │  │                 │  │      │  │  Sharding       │  │
│  │                 │  │      │  │ - CourseRepo    │  │      │  │                 │  │
│  └─────────────────┘  │      │  │ - UserRepo      │  │      │  └─────────────────┘  │
│                       │      │  │ - ProgressRepo  │  │      │                       │
└───────────────────────┘      │  │                 │  │      └───────────────────────┘
                               │  └─────────────────┘  │
                               │                       │
                               │  ┌─────────────────┐  │
                               │  │ Security Layer  │  │
                               │  │                 │  │
                               │  │ - JWT Auth     │  │
                               │  │ - Role-based   │  │
                               │  │   Access Control│  │
                               │  │                 │  │
                               │  └─────────────────┘  │
                               │                       │
                               └───────────────────────┘
```

## Tecnologias Utilizadas

### Frontend
- **Framework Principal**: React (com TypeScript)
- **Bundler/Build Tool**: Vite
- **Gerenciamento de Estado**: Redux Toolkit, React Query
- **Estilização**: Tailwind CSS
- **Editor de Código**: Monaco Editor
- **Roteamento**: React Router v6+
- **Testes**: Vitest, React Testing Library
- **PWA Features**: Workbox

### Backend
- **Framework Principal**: Spring Boot
- **Autenticação**: Spring Security + JWT
- **Acesso a Dados**: Spring Data MongoDB
- **Documentação API**: Swagger/OpenAPI
- **Monitoramento**: Spring Boot Actuator
- **Compilação de Código**: JDoodle API

### Banco de Dados
- **SGBD**: MongoDB
- **Hospedagem**: MongoDB Atlas
- **Caching**: Redis (para dados frequentes)

### DevOps
- **CI/CD**: GitHub Actions
- **Deploy Frontend**: Vercel
- **Deploy Backend**: Render
- **Monitoramento**: NewRelic, UptimeRobot, LogRocket
- **Qualidade de Código**: SonarCloud

## Funcionalidades Principais

### 1. Cursos de Programação
- Conteúdo estruturado (texto, vídeo e demonstrações)
- Exercícios práticos com feedback automático
- Projetos práticos integrando múltiplos conceitos
- Suporte para múltiplas linguagens (Python, JavaScript, Java, C++, etc.)
- Ambiente de codificação integrado

### 2. Gestão de Usuários
- Perfis para alunos, instrutores e administradores
- Dashboard personalizado e histórico de atividades
- Personalização de perfil com avatar e biografia
- Integração social para compartilhar conquistas

### 3. Progresso do Aluno
- Dashboard analítico com visualização gráfica
- Sistema de gamificação (pontos, badges e níveis)
- Certificados digitais com verificação via blockchain
- Recomendações personalizadas baseadas no histórico

### 4. Comunicação
- Fórum de discussão categorizado por tópicos
- Chat em tempo real entre alunos e instrutores
- Sistema de tickets para suporte técnico
- Notificações por email, push browser e in-app

## Estrutura do Projeto

### Frontend (React + TypeScript + Vite)

```
lms-frontend/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── editor/
│   │   ├── courses/
│   │   └── layout/
│   ├── containers/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Courses/
│   │   └── Profile/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Course.tsx
│   │   ├── Lesson.tsx
│   │   └── Profile.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── courses.service.ts
│   ├── store/
│   │   ├── slices/
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourse.ts
│   │   └── useProgress.ts
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts
│   └── routes.tsx
├── tests/
│   ├── unit/
│   └── integration/
├── .eslintrc.js
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── README.md
```

### Backend (Spring Boot)

```
lms-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/codeodisseyprogramming/
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── MongoConfig.java
│   │   │       │   └── WebConfig.java
│   │   │       ├── controllers/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── CourseController.java
│   │   │       │   ├── UserController.java
│   │   │       │   └── CodeController.java
│   │   │       ├── models/
│   │   │       │   ├── User.java
│   │   │       │   ├── Course.java
│   │   │       │   ├── Lesson.java
│   │   │       │   ├── Exercise.java
│   │   │       │   └── Progress.java
│   │   │       ├── repositories/
│   │   │       │   ├── UserRepository.java
│   │   │       │   ├── CourseRepository.java
│   │   │       │   └── ProgressRepository.java
│   │   │       ├── services/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── CourseService.java
│   │   │       │   ├── UserService.java
│   │   │       │   └── CodeExecutionService.java
│   │   │       ├── security/
│   │   │       │   ├── JwtTokenProvider.java
│   │   │       │   ├── UserDetailsServiceImpl.java
│   │   │       │   └── JwtAuthFilter.java
│   │   │       ├── dtos/
│   │   │       │   ├── requests/
│   │   │       │   └── responses/
│   │   │       ├── exceptions/
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   ├── ResourceNotFoundException.java
│   │   │       │   └── UnauthorizedException.java
│   │   │       └── CodeOdisseyApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/
│       └── java/
│           └── com/codeodisseyprogramming/
│               ├── controllers/
│               ├── services/
│               └── repositories/
├── .gitignore
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

### Banco de Dados (MongoDB)

#### Principais Coleções

1. **users**
```json
{
  "_id": ObjectId,
  "email": String,
  "passwordHash": String,
  "role": Enum["student", "instructor", "admin"],
  "profile": {
    "name": String,
    "avatar": String,
    "bio": String,
    "socialLinks": Array
  },
  "preferences": Object,
  "createdAt": Date,
  "lastLogin": Date
}
```

2. **courses**
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "level": Enum["beginner", "intermediate", "advanced"],
  "technologies": Array,
  "instructor": ObjectId,
  "modules": Array[{
    "title": String,
    "lessons": Array[{
      "title": String,
      "content": String,
      "videoUrl": String,
      "duration": Number,
      "exercises": Array[ObjectId]
    }]
  }],
  "enrolledCount": Number,
  "rating": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

3. **progress**
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "courseId": ObjectId,
  "modulesProgress": Array[{
    "moduleId": ObjectId,
    "completed": Boolean,
    "lessonsProgress": Array[{
      "lessonId": ObjectId,
      "status": Enum["not_started", "in_progress", "completed"],
      "timeSpent": Number,
      "lastAccessed": Date
    }]
  }],
  "exercisesCompleted": Array[ObjectId],
  "certificateIssued": Boolean,
  "certificateUrl": String,
  "startDate": Date,
  "lastUpdated": Date
}
```

4. **exercises**
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "difficulty": Enum["easy", "medium", "hard"],
  "language": String,
  "starterCode": String,
  "testCases": Array[{
    "input": String,
    "expectedOutput": String,
    "isVisible": Boolean
  }],
  "solution": String,
  "hints": Array[String],
  "pointsValue": Number
}
```

5. **discussions**
```json
{
  "_id": ObjectId,
  "title": String,
  "content": String,
  "authorId": ObjectId,
  "courseId": ObjectId,
  "lessonId": ObjectId,
  "tags": Array[String],
  "replies": Array[{
    "content": String,
    "authorId": ObjectId,
    "createdAt": Date,
    "upvotes": Number
  }],
  "createdAt": Date,
  "updatedAt": Date,
  "views": Number,
  "isResolved": Boolean
}
```

## Configuração de Desenvolvimento

### Pré-requisitos

#### Para Desenvolvedores Frontend
- Node.js (v16+)
- npm (v7+) ou Yarn (v1.22+)
- Git (v2.30+)
- VS Code com extensões recomendadas:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin (Volar)
  - Tailwind CSS IntelliSense
  - React Developer Tools
  - EditorConfig

#### Para Desenvolvedores Backend
- JDK 17+
- Maven 3.8+ ou Gradle 7+
- IntelliJ IDEA ou Eclipse com plugins Spring
- MongoDB Community Edition (local)
- Postman ou Insomnia para teste de API

### Instalação

#### 1. Clone o repositório

```bash
# Clone o repositório principal
git clone https://github.com/yourusername/lms-programacao.git
cd lms-programacao

# Clone os subrepositórios (se aplicável)
git submodule update --init --recursive
```

#### 2. Configuração do Frontend

```bash
# Navegue para o diretório do frontend
cd lms-frontend

# Instale as dependências
npm install
# ou
yarn install

# Copie o arquivo de ambiente de exemplo
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

#### 3. Configuração do Backend

```bash
# Navegue para o diretório do backend
cd lms-backend

# Compile o projeto e baixe as dependências
mvn clean install
# ou
./gradlew build

# Configure as variáveis de ambiente para desenvolvimento
cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties
# Edite o arquivo com suas configurações locais

# Inicie o servidor de desenvolvimento
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# ou
./gradlew bootRun --args='--spring.profiles.active=dev'
```

#### 4. Configuração do Banco de Dados

Para desenvolvimento local:

```bash
# Inicie o MongoDB localmente
mongod --dbpath /path/to/data/directory

# Alternativamente, use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Para usar MongoDB Atlas:
1. Crie uma conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configure um cluster gratuito
3. Obtenha a string de conexão e adicione-a ao arquivo `application-dev.properties`

### Configuração do Monaco Editor

O Monaco Editor é uma parte essencial do ambiente de codificação integrado. Para configurá-lo corretamente:

1. Instale o pacote:
```bash
npm install monaco-editor
# ou
yarn add monaco-editor
```

2. Configure o Vite (através de plugins) para lidar com os web workers do Monaco
3. Adicione as configurações para as linguagens suportadas

## Implantação (Deploy)

### Frontend (Vercel)

1. Crie uma conta na [Vercel](https://vercel.com/)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente necessárias
4. Configure o domínio personalizado (opcional)

Exemplo de configuração `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/favicon.ico", "dest": "/favicon.ico" },
    { "src": "/robots.txt", "dest": "/robots.txt" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Backend (Render)

1. Crie uma conta na [Render](https://render.com/)
2. Crie um novo serviço Web
3. Conecte ao repositório GitHub
4. Configure como um serviço Docker
5. Especifique variáveis de ambiente
6. Configure domínio personalizado (opcional)

Exemplo de `Dockerfile` para o backend:
```dockerfile
FROM openjdk:17-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
```

### Banco de Dados (MongoDB Atlas)

1. Configure um cluster em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie usuários com privilégios adequados
3. Configure a whitelist de IPs para o Render
4. Obtenha a URI de conexão para seu aplicativo
5. Configure backup automático

## CI/CD

### Fluxo de Trabalho GitHub Actions

O projeto utiliza GitHub Actions para automação de CI/CD.

#### Exemplo de workflow para o frontend:

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'lms-frontend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'lms-frontend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./lms-frontend

    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
        cache-dependency-path: lms-frontend/package-lock.json

    - name: Install Dependencies
      run: npm ci

    - name: Lint
      run: npm run lint

    - name: Test
      run: npm run test

    - name: Build
      run: npm run build

    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      with:
        projectBaseDir: lms-frontend

    - name: Deploy to Vercel
      if: github.ref == 'refs/heads/main'
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./lms-frontend
```

#### Exemplo de workflow para o backend:

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'lms-backend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'lms-backend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./lms-backend

    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven

    - name: Build with Maven
      run: mvn -B package --file pom.xml

    - name: Run Tests
      run: mvn test

    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      with:
        projectBaseDir: lms-backend

    - name: Build and Push Docker Image
      if: github.ref == 'refs/heads/main'
      uses: docker/build-push-action@v2
      with:
        context: ./lms-backend
        push: true
        tags: ${{ secrets.DOCKER_REGISTRY }}/lms-backend:latest

    - name: Deploy to Render
      if: github.ref == 'refs/heads/main'
      run: |
        curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

## Testes

### Testes Unitários

#### Frontend (Vitest + React Testing Library)
```bash
# Execute todos os testes
npm test

# Execute testes com cobertura
npm test -- --coverage

# Execute testes em modo watch
npm test -- --watch
```

#### Backend (JUnit + Mockito)
```bash
# Execute todos os testes
mvn test

# Execute testes com cobertura
mvn verify
```

### Testes de Integração

#### API (REST Assured)
```bash
# Execute testes de integração
mvn verify -P integration-tests
```

#### UI (Cypress)
```bash
# Abra o Cypress em modo interativo
npm run cypress:open

# Execute testes em modo headless
npm run cypress:run
```

### Testes de Segurança

O projeto utiliza ferramentas automatizadas para testes de segurança:

- OWASP ZAP para scan automático
- SonarQube para análise estática
- npm audit / OWASP Dependency Check
- JWT Scanner para vulnerabilidades em tokens

## Segurança

### Proteção de Dados
- Senhas armazenadas com BCrypt (fator de custo 12+)
- Dados sensíveis criptografados com AES-256
- Comunicação HTTPS com TLS 1.3
- Tokens JWT com rotação frequente

### Auditorias e Monitoramento
- Logs de segurança para autenticação e acesso
- Análise automatizada de vulnerabilidades
- Proteção contra ataques comuns (XSS, CSRF, injeção)

### Conformidade
- LGPD (Lei Geral de Proteção de Dados)
- Mecanismos para exportação/exclusão de dados pessoais
- Verificação de idade e proteção para menores

## Escalabilidade

O sistema foi projetado para escalar gradualmente:

### Fase 1: MVP (até 1.000 usuários)
- Planos gratuitos de serviços em nuvem
- Monitoramento básico de uso

### Fase 2: Crescimento Inicial (1.000-10.000 usuários)
- Upgrade para planos pagos iniciais
- Implementação de cache Redis
- CDN para conteúdo estático

### Fase 3: Escala (10.000+ usuários)
- Migração para infraestrutura mais robusta
- Sharding do banco de dados
- Auto-scaling baseado em demanda

## Monitoramento

O projeto utiliza as seguintes ferramentas para monitoramento:

- **NewRelic** (plano gratuito) para APM
- **UptimeRobot** para monitoramento de disponibilidade
- **LogRocket** para sessões de usuário
- **CloudWatch** (AWS Free Tier) para métricas de uso

## Contribuição

### Fluxo de Trabalho
1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- **Frontend**: Seguir padrão Airbnb para JavaScript/TypeScript
- **Backend**: Seguir convenções de código Java da Google
- Todos os PRs devem passar na verificação de CI antes do merge

## Planejamento de Versões

### MVP (v1.0.0)
- Sistema básico de autenticação
- Criação e gerenciamento de cursos
- Editor de código com suporte a linguagens principais
- Acompanhamento básico de progresso

### Versão 1.1.0
- Sistema de gamificação
- Fórum de discussão
- Certificados digitais
- Suporte para mais linguagens de programação

### Versão 1.2.0
- Chat em tempo real
- Análises avançadas de progresso
- Sistema de mentoria
- Integração com GitHub

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

## Como Clonar e Usar o Repositório

### 1. Clone o Repositório Principal

```bash
git clone https://github.com/yourusername/lms-programacao.git
cd lms-programacao
```

### 2. Configuração Inicial

#### Frontend
```bash
cd lms-frontend
npm install
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
npm run dev
```

#### Backend
```bash
cd lms-backend
mvn clean install
cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties
# Edite o arquivo application-dev.properties com suas configurações
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Configuração do Banco de Dados

Opção 1: MongoDB local
```bash
mongod --dbpath /path/to/data/directory
```

Opção 2: MongoDB com Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Opção 3: MongoDB Atlas
1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configure um cluster gratuito
3. Obtenha a string de conexão e adicione-a ao arquivo `application-dev.properties`

### 4. Acesse o Aplicativo

- Frontend: http://localhost:3000 (ou a porta configurada pelo Vite)
- Backend: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html

### 5. Fluxo de Trabalho de Desenvolvimento

1. Crie um branch para sua feature
```bash
git checkout -b feature/nova-funcionalidade
```

2. Faça suas alterações e teste localmente

3. Commit e push para seu branch
```bash
git add .
git commit -m "Implementa nova funcionalidade XYZ"
git push origin feature/nova-funcionalidade
```

4. Abra um Pull Request no GitHub

5. Aguarde o CI passar e a revisão de código

---
