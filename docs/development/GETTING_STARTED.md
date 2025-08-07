# Getting Started with TaskFlow Development

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/MJ-Sarabando/taskflow-platform.git
   cd taskflow-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Database: localhost:5432

## Development Commands

- `npm run dev` - Start both frontend and backend
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run build` - Build both applications

## Project Structure

```
taskflow-platform/
├── frontend/          # Next.js application
├── backend/           # Node.js API
├── database/          # Database scripts
├── docker/           # Docker configurations
├── docs/             # Documentation
└── tests/            # E2E tests
```
