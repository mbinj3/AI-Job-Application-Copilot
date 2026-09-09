# AI Job Application Copilot

> A production-grade, AI-powered assistant for crafting tailored job applications, analyzing job descriptions, and tracking your career journey.

---

## 🗂️ Project Structure

```
ai-job-application-copilot/
├── apps/
│   ├── web/          # Next.js 15 frontend (App Router + Hero UI + Tailwind CSS)
│   └── api/          # Express.js REST API (TypeScript)
├── packages/
│   └── shared/       # Shared TypeScript types, constants, and interfaces
├── docs/             # Project documentation
├── .env.example      # Environment variable template
├── turbo.json        # Turborepo pipeline configuration
└── package.json      # Monorepo root (npm workspaces)
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0

### 1. Clone and install

```bash
git clone <repository-url> ai-job-application-copilot
cd ai-job-application-copilot
npm install
```

### 2. Configure environment variables

```bash
# Copy the root template
cp .env.example .env.local

# Copy app-level templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 3. Start development servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually
npm run dev:web    # Next.js frontend → http://localhost:3000
npm run dev:api    # Express API     → http://localhost:4000
```

### 4. Verify the setup

| Check      | URL                              |
| ---------- | -------------------------------- |
| Frontend   | http://localhost:3000            |
| API Health | http://localhost:4000/api/health |

---

## 🛠️ Available Commands

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start all apps in development mode           |
| `npm run dev:web`      | Start only the Next.js frontend              |
| `npm run dev:api`      | Start only the Express API                   |
| `npm run build`        | Build all packages and apps                  |
| `npm run build:shared` | Build shared package only                    |
| `npm run lint`         | Run ESLint across the monorepo               |
| `npm run format`       | Format all files with Prettier               |
| `npm run format:check` | Check formatting without writing             |
| `npm run type-check`   | TypeScript type checking across all packages |
| `npm run clean`        | Remove all build artifacts                   |

---

## 🏗️ Technology Stack

### Frontend (`apps/web`)

- **Next.js 15** — App Router, Server Components, TypeScript
- **Hero UI** — Accessible, beautiful component library
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Lucide React** — Icon library

### Backend (`apps/api`)

- **Node.js 20+** — Runtime
- **Express.js** — Web framework
- **TypeScript** — Type safety
- **Helmet** — Security headers
- **CORS** — Cross-origin configuration

### Monorepo Tooling

- **Turborepo** — Build system and task pipeline
- **npm Workspaces** — Package management
- **ESLint + Prettier** — Code quality and formatting

---

## 📖 Documentation

Detailed documentation lives in the [`docs/`](./docs/) directory:

- [`docs/architecture.md`](./docs/architecture.md) — System design and architectural decisions
- [`docs/development-setup.md`](./docs/development-setup.md) — Full local development guide
- [`docs/project-structure.md`](./docs/project-structure.md) — Directory structure reference

---

## 🔒 Environment Variables

Never commit `.env` files containing real secrets. Always use `.env.example` as the template.

See [`.env.example`](./.env.example) for all required variables with descriptions.

---

## 📄 License

Private — All rights reserved.
