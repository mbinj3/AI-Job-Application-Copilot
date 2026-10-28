# CareerPilot AI — AI Job Application Copilot

> An AI-powered assistant designed to help job seekers evaluate opportunities, understand how their resumes align with job requirements and prepare tailored application materials.

---

## 🎯 The Problem

Job seekers often spend significant time reviewing job descriptions, comparing requirements against their resumes, identifying skill gaps and customizing application materials for every role. This repetitive process can make job searching inefficient and difficult to manage consistently.

## 💡 The Solution

**CareerPilot AI** brings key job-application preparation tasks into one workflow. Users provide a job description and their resume, then receive an AI-assisted job analysis, resume-to-job match insights, missing-skill detection, resume improvement suggestions, a tailored cover letter and job-specific interview questions.

The application is intended to support informed decisions and more targeted applications. AI-generated suggestions should be reviewed for accuracy before use.

## 📌 Overview

CareerPilot AI is a full-stack web application built around a simple workflow:

1. A new user creates an account, verifies their email if verification is enabled, signs in and completes their profile.
2. The user uploads a PDF/DOCX resume or pastes resume text.
3. The application processes the resume and analyzes its skills, experience, education and keywords.
4. The user pastes a job description.
5. The AI analyzes the job requirements and extracts relevant skills, experience expectations, responsibilities and keywords.
6. The matching workflow compares the resume with the job description and presents a match score with supporting insights.
7. The application identifies potential skill gaps and provides resume improvement suggestions.
8. The user generates a tailored cover letter and job-specific interview questions.
9. The user reviews and saves or exports the results.

Returning users can sign in and continue from the dashboard using their saved profile and resume.

## ✨ Features

- **Account and profile management** — Sign up, sign in and maintain professional details and job preferences.
- **Resume input and processing** — Upload supported PDF/DOCX files or paste resume text for processing.
- **AI resume analysis** — Extract skills, experience, education, technologies and relevant keywords.
- **Job description analysis** — Identify the role, required skills, experience expectations, responsibilities and keywords.
- **Resume-to-job matching** — Compare candidate information with job requirements and provide a match score with an explanation.
- **Missing-skill detection** — Highlight requirements that may be absent or insufficiently demonstrated in the resume.
- **Resume improvement suggestions** — Recommend relevant keywords, skills to emphasize and ways to improve resume content without inventing candidate experience.
- **Tailored cover letters** — Generate a draft based on the job description and the candidate's provided background.
- **Interview preparation** — Generate technical, behavioral and role-specific interview questions.
- **Saved analysis workflow** — Keep relevant profile, resume, job and analysis data available to signed-in users as implemented.
- **Validated AI output** — Use structured output and schema validation to make AI responses easier to validate and handle reliably.

## 💻 Technology Stack

### Frontend
- **Next.js** — React framework and application routing.
- **Hero UI** — React component library for accessible interface components.
- **TypeScript** — Type-safe frontend development.

### Backend
- **Node.js** — JavaScript runtime.
- **Express.js** — REST API framework.
- **TypeScript** — Type-safe backend development.
- **Zod** — Request and structured-data validation.
- **Pino** — Structured application logging.

### Database and Data Access
- **PostgreSQL (Prisma Postgres)** — Relational database.
- **Prisma ORM** — Database schema, migrations and type-safe data access.

### AI and File Processing
- **LLM API** — AI-assisted job analysis, resume analysis, matching insights, cover-letter drafting and interview-question generation.
- **Structured AI output** — Consistent, schema-oriented responses.
- **File processing** — Extract text from supported resume documents for analysis.

### Testing and Deployment
- **Vitest** — Automated unit and integration testing.
- **Docker** — Containerized development and deployment.
- **CI/CD with GitHub Actions** — Automated quality checks and deployment workflow.
- **AWS** — Cloud deployment and supporting infrastructure.

## 🗂️ Project Structure

The repository uses a monorepo layout to keep the frontend, API, shared code and documentation organized.

```text
careerpilot-ai/
├── apps/
│   ├── web/                 # Next.js frontend (App Router, Hero UI, TypeScript)
│   └── api/                 # Express REST API (TypeScript, Prisma)
│       └── prisma/          # Prisma schema and migration history
├── packages/
│   └── shared/              # Shared TypeScript types, constants and interfaces
├── docs/                    # Project documentation
├── .env.example             # Root environment variable template
├── turbo.json               # Turborepo pipeline configuration
└── package.json             # Monorepo root and npm workspaces
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later
- A **Prisma Postgres** account: [console.prisma.io](https://console.prisma.io)

### 1. Clone and install

Replace `<repository-url>` with the URL of your GitHub repository.

```bash
git clone <repository-url> careerpilot-ai
cd careerpilot-ai
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Open the relevant environment files and configure the values required by your local setup, including the `DATABASE_URL` in `apps/api/.env`. Never commit real secrets.

### 3. Generate Prisma Client and run migrations

```bash
npm run db:generate --workspace=@copilot/api
npm run db:migrate --workspace=@copilot/api
```

### 4. Start the development servers

```bash
npm run dev
```

Or start each application separately:

```bash
npm run dev:web
npm run dev:api
```

The documented local URLs are:

| Service | URL |
|---|---|
| Next.js frontend | `http://localhost:3000` |
| Express API health | `http://localhost:4000/api/v1/health` |
| Database readiness | `http://localhost:4000/api/v1/health/db` |

## 📋 Available Commands

### Development

| Command | Description |
|---|---|
| `npm run dev` | Start the applications in development mode |
| `npm run dev:web` | Start the Next.js frontend |
| `npm run dev:api` | Start the Express API |

### Build and Code Quality

| Command | Description |
|---|---|
| `npm run build` | Build packages and applications |
| `npm run build:shared` | Build the shared package |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting without changing files |
| `npm run type-check` | Run TypeScript checks |
| `npm run clean` | Remove build artifacts |

### Database

| Command | Description |
|---|---|
| `npm run db:generate --workspace=@copilot/api` | Generate Prisma Client |
| `npm run db:migrate --workspace=@copilot/api` | Create and apply a database migration |
| `npm run db:studio --workspace=@copilot/api` | Open Prisma Studio |
| `npm run db:push --workspace=@copilot/api` | Push schema changes without creating a migration file |

## 🗄️ Database

The application is planned to use **Prisma Postgres** as its managed PostgreSQL database, accessed through Prisma ORM.

### Database workflow

```text
Prisma schema (schema.prisma)
        ↓
Prisma migration
        ↓
Prisma Postgres
        ↓
Generated Prisma Client
        ↓
Express services and controllers
```


| Model | Table | Purpose |
|---|---|---|
| `User` | `users` | User identity and authentication credentials |
| `UserProfile` | `user_profiles` | Professional and biographical details |
| `Resume` | `resumes` | Resume versions and parsed content |


## 🔐 Environment Variables

See [`.env.example`](./.env.example) for the root environment variable template.

| Variable | Location | Purpose |
|---|---|---|
| `DATABASE_URL` | `apps/api/.env` | Prisma Postgres connection string |
| `PORT` | `apps/api/.env` | API server port; documented default is `4000` |
| `NODE_ENV` | `apps/api/.env` | Runtime environment mode |

---

## 📖 Documentation

Detailed documentation lives in the [`docs/`](./docs/) directory:

- [`docs/architecture.md`](./docs/architecture.md) — System design and architectural decisions
- [`docs/development-setup.md`](./docs/development-setup.md) — Full local development guide
- [`docs/project-structure.md`](./docs/project-structure.md) — Directory structure reference

---

## 📄 License

Private — All rights reserved.
