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
- `apps/api` (Express backend)
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

Required variables for local development (already have defaults):

- `PORT=4000`
- `NODE_ENV=development`
- `CORS_ORIGIN=http://localhost:3000`

### Frontend

```bash
cp apps/web/.env.example apps/web/.env.local
```

Required variables:

- `NEXT_PUBLIC_API_URL=http://localhost:4000/api`

---

## Step 4 — Start Development Servers

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

## Step 5 — Verify the Setup

| Service    | URL                              | Expected                         |
| ---------- | -------------------------------- | -------------------------------- |
| Frontend   | http://localhost:3000            | Homepage with Hero UI components |
| API Health | http://localhost:4000/api/health | JSON with `"status": "ok"`       |

**PowerShell health check:**

```powershell
Invoke-RestMethod http://localhost:4000/api/health | ConvertTo-Json
```

---

## Available Commands

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start all apps (frontend + API)         |
| `npm run dev:web`      | Frontend only                           |
| `npm run dev:api`      | API only                                |
| `npm run build`        | Production build for all packages       |
| `npm run build:shared` | Build shared package types              |
| `npm run lint`         | Run ESLint across the monorepo          |
| `npm run format`       | Auto-format all files with Prettier     |
| `npm run format:check` | Check formatting (CI mode)              |
| `npm run type-check`   | TypeScript type check (no emit)         |
| `npm run clean`        | Remove all `dist/`, `.next/`, `.turbo/` |

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
