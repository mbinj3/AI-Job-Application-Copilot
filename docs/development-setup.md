# Development Setup Guide

## Prerequisites

Ensure the following tools are installed before starting:

| Tool    | Minimum Version | Check           |
| ------- | --------------- | --------------- |
| Node.js | 20.0.0          | `node -v`       |
| npm     | 10.0.0          | `npm -v`        |
| Git     | Any recent      | `git --version` |

---

## Step 1 — Clone the Repository

```bash
git clone <repository-url> ai-job-application-copilot
cd ai-job-application-copilot
```

---

## Step 2 — Install All Dependencies

From the **monorepo root**, run:

```bash
npm install
```

This installs dependencies for:

- `apps/web` (Next.js frontend)
- `apps/api` (Express backend + Prisma)
- `packages/shared` (shared types)
- Root dev tools (Turborepo, Prettier, TypeScript)

---

## Step 3 — Configure Environment Variables

### Root-level

```bash
cp .env.example .env.local
```

### API

```bash
cp apps/api/.env.example apps/api/.env
```

Then open `apps/api/.env` and fill in your actual `DATABASE_URL`.

**Required variables for local development:**

| Variable       | Description                                      | Example                                                          |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| `PORT`         | API server port                                  | `4000`                                                           |
| `NODE_ENV`     | Environment mode                                 | `development`                                                    |
| `CORS_ORIGIN`  | Allowed frontend origin                          | `http://localhost:3000`                                          |
| `DATABASE_URL` | Prisma Postgres connection string                | `prisma+postgres://accelerate.prisma-data.net/?api_key=<key>`   |

### Frontend

```bash
cp apps/web/.env.example apps/web/.env.local
```

Required variables:

- `NEXT_PUBLIC_API_URL=http://localhost:4000/api`

---

## Step 4 — Configure Prisma Postgres

### 4a. Obtain a Prisma Postgres connection string

1. Go to [https://console.prisma.io](https://console.prisma.io)
2. Create a new project or select an existing one
3. Create a Prisma Postgres database instance
4. Copy the connection string — it will look like:
   ```
   prisma+postgres://accelerate.prisma-data.net/?api_key=<YOUR_API_KEY>
   ```
5. Paste it as `DATABASE_URL` in `apps/api/.env`

### 4b. Generate Prisma Client

```bash
npm run db:generate --workspace=@copilot/api
```

This reads `apps/api/prisma/schema.prisma` and generates the fully typed Prisma Client into `node_modules/@prisma/client`.

### 4c. Run the First Migration

```bash
npm run db:migrate --workspace=@copilot/api
```

> When prompted, enter a migration name (e.g. `init`).

This applies the SQL schema to your Prisma Postgres database and creates the `users`, `user_profiles`, and `resumes` tables.

### 4d. Verify Database Connection

With the API running, hit the database readiness endpoint:

```powershell
Invoke-RestMethod http://localhost:4000/api/v1/health/db | ConvertTo-Json
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection is healthy",
  "data": {
    "status": "ok",
    "connected": true,
    "latencyMs": 42,
    "timestamp": "2026-09-15T..."
  }
}
```

---

## Step 5 — Start Development Servers

```bash
# Start both frontend and API concurrently via Turborepo
npm run dev
```

Or start individually in separate terminals:

```bash
# Terminal 1 — Next.js frontend
npm run dev:web

# Terminal 2 — Express API
npm run dev:api
```

---

## Step 6 — Verify the Setup

| Service       | URL                                 | Expected                                    |
| ------------- | ----------------------------------- | ------------------------------------------- |
| Frontend      | http://localhost:3000               | Homepage with Hero UI components            |
| API Health    | http://localhost:4000/api/v1/health | JSON with `"status": "ok"`                  |
| DB Readiness  | http://localhost:4000/api/v1/health/db | JSON with `"connected": true`            |

**PowerShell health checks:**

```powershell
# API liveness
Invoke-RestMethod http://localhost:4000/api/v1/health | ConvertTo-Json

# Database readiness
Invoke-RestMethod http://localhost:4000/api/v1/health/db | ConvertTo-Json
```

---

## Available Commands

### Development

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start all apps (frontend + API)         |
| `npm run dev:web`      | Frontend only                           |
| `npm run dev:api`      | API only                                |

### Building & Quality

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run build`        | Production build for all packages       |
| `npm run build:shared` | Build shared package types              |
| `npm run lint`         | Run ESLint across the monorepo          |
| `npm run format`       | Auto-format all files with Prettier     |
| `npm run format:check` | Check formatting (CI mode)              |
| `npm run type-check`   | TypeScript type check (no emit)         |
| `npm run clean`        | Remove all `dist/`, `.next/`, `.turbo/` |

### Database (run from monorepo root)

| Command                                                | Description                                             |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `npm run db:generate --workspace=@copilot/api`         | Generate Prisma Client from schema                      |
| `npm run db:migrate --workspace=@copilot/api`          | Create and apply new migration (`migrate dev`)          |
| `npm run db:studio --workspace=@copilot/api`           | Open Prisma Studio (visual DB browser)                  |
| `npm run db:push --workspace=@copilot/api`             | Push schema changes to DB without a migration file      |

Or use the shorthand scripts directly inside `apps/api`:

```bash
cd apps/api
npx prisma migrate dev --name <migration_name>
npx prisma generate
npx prisma studio
```

---

## Working with Individual Packages

Run a command in a specific workspace:

```bash
# Build only the API
npm run build --workspace=@copilot/api

# Run only web dev
npm run dev --workspace=@copilot/web

# Type-check only shared package
npm run type-check --workspace=@copilot/shared
```

---

## Troubleshooting

### `Cannot find module '@copilot/shared'`

Build the shared package first:

```bash
npm run build:shared
```

### `DATABASE_URL` not set / connection refused

1. Ensure `apps/api/.env` exists and contains a valid `DATABASE_URL`
2. Verify your Prisma Postgres instance is active at [https://console.prisma.io](https://console.prisma.io)
3. Check the database health endpoint: `GET /api/v1/health/db`

### Prisma Client out of sync with schema

Regenerate after any schema change:

```bash
npm run db:generate --workspace=@copilot/api
```

### Port already in use

Change the port in the relevant `.env` file:

```bash
# apps/api/.env
PORT=4001
```

### TypeScript errors after pulling changes

```bash
npm run clean
npm install
npm run build
```

### Turborepo cache issues

```bash
npx turbo daemon stop
npm run clean
```
