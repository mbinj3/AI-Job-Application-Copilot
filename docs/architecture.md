# Architecture — AI Job Application Copilot

## Overview

The AI Job Application Copilot is a full-stack, AI-augmented web application built in a monorepo. The system helps users:

- Parse and store their resumes
- Analyze job descriptions for fit and skill gaps
- Generate tailored cover letters and resume versions
- Track application status across the job search lifecycle

---

## Monorepo Boundary Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     Monorepo Root                               │
│  (npm workspaces + Turborepo pipeline)                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │  apps/web   │  │  apps/api   │  │  packages/shared     │   │
│  │  Next.js    │  │  Express.js │  │  TypeScript types    │   │
│  │  Hero UI    │  │  TypeScript │  │  API contracts       │   │
│  │  Port 3000  │  │  Port 4000  │  │  Domain models       │   │
│  └──────┬──────┘  └──────┬──────┘  └──────────────────────┘   │
│         │                │                     ▲               │
│         └────────────────┴─────────────────────┘               │
│                     Shared types used by both                   │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (`apps/web`)

### Framework: Next.js 15 — App Router

```
src/
└── app/
    ├── layout.tsx       # Root layout: metadata, fonts, Providers
    ├── providers.tsx    # Client-side: HeroUIProvider
    ├── globals.css      # Tailwind directives + base styles
    └── page.tsx         # Homepage
```

**Key Decisions:**

- **App Router** is used exclusively; the `pages/` directory is not used.
- **Server Components** by default; client components opt in with `'use client'`.
- **`NEXT_PUBLIC_` prefix** is required for any variable exposed to the browser.
- **Hero UI** requires `HeroUIProvider` in a client component wrapping the tree.

## Backend Architecture (`apps/api`)

### Framework: Express.js + TypeScript + Prisma

```
src/
├── server.ts               # Server bootstrap, graceful shutdown (Prisma disconnect)
├── app.ts                  # Express factory (middleware, routes)
├── config/
│   ├── env.ts              # Typed environment config (incl. DATABASE_URL)
│   └── logger.ts           # Pino structured logger
├── db/
│   ├── prisma.ts           # Singleton PrismaClient (hot-reload safe)
│   ├── health.ts           # checkDatabaseConnection() utility
│   └── index.ts            # Database module barrel export
├── controllers/
│   ├── health.controller.ts      # GET /api/v1/health
│   └── health-db.controller.ts   # GET /api/v1/health/db
├── routes/
│   ├── index.ts            # Root API router
│   └── v1/
│       ├── index.ts        # Version 1 router
│       ├── health.routes.ts  # /health, /health/db routes
│       └── test.routes.ts  # Dev-only test error routes
├── middleware/
│   ├── errorHandler.ts     # Global error handler
│   ├── notFound.ts         # 404 handler
│   ├── requestLogger.ts    # Pino HTTP request logging
│   └── validate.ts         # Zod request validation middleware
├── schemas/
│   └── health.schema.ts    # Zod schemas for health endpoint
├── services/
│   └── health.service.ts   # Health status business logic
└── utils/
    ├── asyncHandler.ts     # Async route wrapper (catches promise rejections)
    └── errors.ts           # Typed error classes (AppError, NotFoundError, …)
```

**Key Decisions:**

- **Factory pattern** (`createApp()`) in `app.ts` keeps the server and app separately testable.
- **Route → Controller separation** enables clean unit testing without mounting the full server.
- **`tsx watch`** is used for zero-config TypeScript hot-reloading during development.
- **`helmet`** applies security headers to all responses by default.
- **Prisma singleton** with `globalThis` guard prevents connection pool exhaustion on hot-reload.

## Database Architecture (`apps/api/prisma`)

### ORM: Prisma with Prisma Postgres

```
prisma/
├── schema.prisma           # Authoritative database schema
└── migrations/
    └── <timestamp>_init/   # Initial migration SQL (tracked by Git)
        └── migration.sql
```

### Data Flow

```
Prisma schema (schema.prisma)
        ↓  prisma migrate dev
Migration files (prisma/migrations/)
        ↓  applied to
Prisma Postgres (cloud database)
        ↓  prisma generate
Generated Prisma Client (node_modules/@prisma/client)
        ↓  imported by
src/db/prisma.ts (singleton)
        ↓  used by
Express services / controllers
```

### Database Models (Phase 3)

| Model         | Purpose                                         | Key Fields                                     |
| ------------- | ----------------------------------------------- | ---------------------------------------------- |
| `User`        | Core identity record                            | `id`, `email` (unique), `passwordHash`, timestamps |
| `UserProfile` | Professional/biographical data (1:1 with User)  | `firstName`, `lastName`, `headline`, `location`, links |
| `Resume`      | User resume versions (many per User)            | `title`, `originalFilename`, `contentText`, `parsedData` (JSON) |

### Connection Lifecycle

- `PrismaClient` is instantiated once at application start via the singleton in `src/db/prisma.ts`.
- In development, the instance is cached on `globalThis` to survive `tsx watch` hot-reloads.
- `prisma.$disconnect()` is called during graceful shutdown (SIGTERM / SIGINT).

## Shared Package (`packages/shared`)

Contains TypeScript type contracts shared between the frontend and the backend:

| Module               | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `types/api.ts`       | `HealthCheckResponse`, `ApiResponse<T>`, `PaginationMeta` |
| `types/job.ts`       | `JobPostingSummary`, `JobMatchAnalysis`, `JobStatus`      |
| `types/resume.ts`    | `ResumeProfile`, `WorkExperience`, `Education`            |
| `constants/index.ts` | `APP_CONFIG`, `HTTP_STATUS`                               |

## Security Posture

| Concern          | Approach                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| Secrets          | `.env` files, never committed. `.env.example` as template              |
| API Security     | `helmet` for HTTP headers, `cors` for origin whitelisting              |
| Type Safety      | Strict TypeScript across all packages                                  |
| Browser Exposure | `NEXT_PUBLIC_` prefix only for safe, public variables                  |
| Passwords        | Stored as `passwordHash` (String?) — never plaintext. Hashing deferred |
| DB Errors        | Internal errors logged via Pino; only generic messages returned in API |
| DB Credentials   | Read from `DATABASE_URL` env var; never hardcoded                      |

## API Health Endpoints

| Endpoint             | Purpose                                             | DB Dependency |
| -------------------- | --------------------------------------------------- | ------------- |
| `GET /api/v1/health` | Liveness check — server is running                  | None          |
| `GET /api/v1/health/db` | Readiness check — database connection verified   | Yes (SELECT 1) |

## Planned Future Phases

| Phase   | Modules                                                                       |
| ------- | ----------------------------------------------------------------------------- |
| Phase 3 | ✅ Prisma + Prisma Postgres, User/UserProfile/Resume schema, DB health check   |
| Phase 4 | User authentication (JWT), password hashing, auth middleware                  |
| Phase 5 | Resume upload & parsing, AI job description analysis (OpenAI / Anthropic)    |
| Phase 6 | Cover letter generation, resume tailoring                                     |
| Phase 7 | Application tracker dashboard, analytics                                      |
