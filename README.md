# HardwareCRM

A fullstack CRM application for managing basic sales operations in a hardware factory.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19 + Vite, Mantine UI v7     |
| Backend  | Express.js (Node.js 24)            |
| Database | PostgreSQL 17                       |
| ORM      | Prisma                              |

> **Note:** This project does **not** use Next.js. The frontend is a standalone React SPA served by Vite, and the backend is a plain Express.js server.

## Project Structure

```
CRM/
├── client/                # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Mantine-based)
│   │   ├── pages/         # Page-level components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                # Express.js backend
│   ├── src/
│   │   ├── routes/        # Express route handlers
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── .env.example       # Environment variable template (committed)
│   ├── .env               # Local environment variables (git-ignored)
│   ├── tsconfig.json
│   └── package.json
│
├── Dockerfile             # Multi-stage production build
├── docker-compose.yml     # Local dev services (PostgreSQL)
├── .dockerignore
└── README.md
```

## Prerequisites

- **Node.js 24** (use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage versions)
- **Docker** (for running PostgreSQL locally, or for production builds)
- **pnpm** (`npm install -g pnpm`)

## Environment Variables

The backend uses a `.env` file for configuration. A `.env.example` template is provided in `server/`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5431/hardware_crm
```

Copy it to create your local config:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` with your actual database credentials.

## Getting Started

### 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL instance on `localhost:5431` with the credentials from `docker-compose.yml` (user: `postgres`, password: `postgres`, database: `hardware_crm`). Data is persisted in a Docker volume.

To stop it:

```bash
docker compose down
```

### 2. Install dependencies

```bash
# Frontend
cd client
pnpm install

# Backend
cd ../server
pnpm install
```

### 3. Set up the database

Make sure PostgreSQL is running (`docker compose up -d`), then:

```bash
cd server

# Create the database and run migrations
pnpm prisma migrate dev

# (Optional) Seed initial data
pnpm prisma db seed
```

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev          # Runs on http://localhost:3000

# Terminal 2 — Frontend
cd client
npm run dev          # Runs on http://localhost:5173
```

## Current Features

### Landing Page

The initial milestone is a welcome landing page that greets users when they first open the application. It serves as the entry point to the CRM and will later link out to the core sales modules.

## Planned Features

- Customer management (create, view, edit, delete)
- Product / inventory catalog
- Sales order creation and tracking
- Basic reporting and dashboards
- User authentication and role-based access

## Docker Production Build

Build and run the full application as a single container:

```bash
# Build the image
docker build -t hardware-crm .

# Run it (provide your production DATABASE_URL)
docker run -p 3000:3000 -e DATABASE_URL="postgresql://user:pass@host:5432/hardware_crm" hardware-crm
```

The Dockerfile uses a multi-stage build: it compiles the React client and Express server separately, then produces a minimal production image that runs Prisma migrations on startup and serves the API + static frontend on port 3000.

## UI Approach

The frontend is built entirely with [Mantine v7](https://mantine.dev/) components. Prefer native Mantine components (Button, Table, Modal, TextInput, Select, AppShell, etc.) over custom implementations to keep the UI consistent and maintainable.

## Scripts Reference

### Client (`client/`)

| Script          | Description               |
| --------------- | ------------------------- |
| `pnpm dev`   | Start Vite dev server     |
| `pnpm build` | Production build          |
| `pnpm preview` | Preview production build |

### Server (`server/`)

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `pnpm dev`   | Start Express with hot-reload      |
| `pnpm build` | Compile TypeScript                 |
| `pnpm start`  | Run compiled server in production  |
