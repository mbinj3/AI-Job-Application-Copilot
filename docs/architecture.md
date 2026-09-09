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

### Framework: Express.js + TypeScript

```
src/
├── index.ts                # Server bootstrap, graceful shutdown
├── app.ts                  # Express factory (middleware, routes)
├── config/
│   └── env.ts              # Typed environment config
├── routes/
│   ├── index.ts            # Root API router
│   └── health.routes.ts    # /api/health
├── controllers/
│   └── health.controller.ts
└── middlewares/
    ├── requestLogger.ts    # Structured HTTP request logging
    ├── errorHandler.ts     # Global error handler
    └── notFound.ts         # 404 handler
```

**Key Decisions:**

- **Factory pattern** (`createApp()`) in `app.ts` keeps the server and app separately testable.
- **Route → Controller separation** enables clean unit testing without mounting the full server.
- **`tsx watch`** is used for zero-config TypeScript hot-reloading during development.
- **`helmet`** applies security headers to all responses by default.

## Shared Package (`packages/shared`)

Contains TypeScript type contracts shared between the frontend and the backend:

| Module               | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `types/api.ts`       | `HealthCheckResponse`, `ApiResponse<T>`, `PaginationMeta` |
| `types/job.ts`       | `JobPostingSummary`, `JobMatchAnalysis`, `JobStatus`      |
| `types/resume.ts`    | `ResumeProfile`, `WorkExperience`, `Education`            |
| `constants/index.ts` | `APP_CONFIG`, `HTTP_STATUS`                               |

## Security Posture

| Concern          | Approach                                                  |
| ---------------- | --------------------------------------------------------- |
| Secrets          | `.env` files, never committed. `.env.example` as template |
| API Security     | `helmet` for HTTP headers, `cors` for origin whitelisting |
| Type Safety      | Strict TypeScript across all packages                     |
| Browser Exposure | `NEXT_PUBLIC_` prefix only for safe, public variables     |

## Planned Future Phases

| Phase   | Modules                                                                   |
| ------- | ------------------------------------------------------------------------- |
| Phase 2 | User authentication (NextAuth.js + JWT), PostgreSQL + Prisma              |
| Phase 3 | Resume upload & parsing, AI job description analysis (OpenAI / Anthropic) |
| Phase 4 | Cover letter generation, resume tailoring                                 |
| Phase 5 | Application tracker dashboard, analytics                                  |
