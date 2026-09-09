# Project Structure Reference

## Directory Tree

```
ai-job-application-copilot/         # Monorepo root
│
├── apps/                           # Deployable applications
│   ├── web/                        # Next.js 15 frontend (port 3000)
│   │   ├── src/
│   │   │   └── app/                # App Router (Next.js)
│   │   │       ├── layout.tsx      # Root layout: metadata, providers, fonts
│   │   │       ├── providers.tsx   # Client providers (HeroUIProvider)
│   │   │       ├── globals.css     # Tailwind directives + base styles
│   │   │       └── page.tsx        # Homepage / index route
│   │   ├── next.config.ts          # Next.js configuration
│   │   ├── tailwind.config.ts      # Tailwind + Hero UI plugin
│   │   ├── postcss.config.mjs      # PostCSS configuration
│   │   ├── tsconfig.json           # TypeScript config (bundler resolution)
│   │   ├── .env.example            # Frontend env var template
│   │   └── package.json            # @copilot/web dependencies
│   │
│   └── api/                        # Express REST API (port 4000)
│       ├── src/
│       │   ├── index.ts            # Server bootstrap + graceful shutdown
│       │   ├── app.ts              # Express factory (middleware + routes)
│       │   ├── config/
│       │   │   └── env.ts          # Typed environment configuration
│       │   ├── controllers/
│       │   │   └── health.controller.ts  # GET /api/health handler
│       │   ├── middlewares/
│       │   │   ├── requestLogger.ts      # HTTP request logging
│       │   │   ├── errorHandler.ts       # Global error handler
│       │   │   └── notFound.ts           # 404 handler
│       │   └── routes/
│       │       ├── index.ts              # Root API router
│       │       └── health.routes.ts      # /api/health route definition
│       ├── tsconfig.json           # TypeScript config (NodeNext)
│       ├── .env.example            # API env var template
│       └── package.json            # @copilot/api dependencies
│
├── packages/                       # Shared internal packages
│   └── shared/                     # @copilot/shared — shared types/constants
│       ├── src/
│       │   ├── index.ts            # Package entry point (re-exports all)
│       │   ├── types/
│       │   │   ├── api.ts          # ApiResponse, HealthCheckResponse, Pagination
│       │   │   ├── job.ts          # JobPostingSummary, JobMatchAnalysis
│       │   │   └── resume.ts       # ResumeProfile, WorkExperience, Education
│       │   └── constants/
│       │       └── index.ts        # APP_CONFIG, HTTP_STATUS
│       ├── tsconfig.json           # TypeScript config (NodeNext + composite)
│       └── package.json            # @copilot/shared configuration
│
├── docs/                           # Project documentation
│   ├── architecture.md             # System design and decisions
│   ├── development-setup.md        # Local dev environment guide
│   └── project-structure.md        # This file
│
├── .env.example                    # Master env var template
├── .gitignore                      # Comprehensive git ignore rules
├── .prettierrc                     # Prettier formatting config
├── .prettierignore                 # Files excluded from formatting
├── eslint.config.mjs               # Root flat ESLint config
├── turbo.json                      # Turborepo pipeline tasks
├── package.json                    # Monorepo root (npm workspaces)
└── README.md                       # Project overview + quick start
```

---

## Module Responsibilities

### `apps/web` — Frontend Application

- Renders the user interface with Next.js App Router and React Server Components.
- Consumes `@copilot/api` over HTTP using type contracts from `@copilot/shared`.
- Uses Hero UI components and Tailwind CSS for styling.
- Browser-safe variables must use the `NEXT_PUBLIC_` prefix.

### `apps/api` — Backend REST API

- Exposes a typed REST API consumed by the frontend.
- Uses `@copilot/shared` types for response contracts.
- Future home for: authentication, resume processing, AI service integrations, database access.

### `packages/shared` — Shared Types & Constants

- Source of truth for all type contracts crossing the frontend/backend boundary.
- Zero runtime dependencies — pure TypeScript types and constant values.
- Both `apps/web` and `apps/api` depend on this package.

---

## Naming Conventions

| Item                | Convention         | Example                       |
| ------------------- | ------------------ | ----------------------------- |
| Files               | `kebab-case.ts`    | `health.controller.ts`        |
| React Components    | `PascalCase.tsx`   | `providers.tsx` → `Providers` |
| Variables/functions | `camelCase`        | `getHealthCheck`              |
| Types/Interfaces    | `PascalCase`       | `HealthCheckResponse`         |
| Constants           | `UPPER_SNAKE_CASE` | `HTTP_STATUS`                 |
| npm packages        | `@copilot/<name>`  | `@copilot/shared`             |

---

## Adding a New Feature

1. **Define types** in `packages/shared/src/types/` and export from `index.ts`
2. **Build the API endpoint**: add controller → route → mount in `apps/api/src/routes/index.ts`
3. **Build the UI**: add Next.js page/component in `apps/web/src/app/`
4. **Update `.env.example`** if new environment variables are required
