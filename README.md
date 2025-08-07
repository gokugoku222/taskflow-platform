# 📋 TaskFlow - Collaborative Task Management Platform

> **Status**: 🚧 In Development | **Current Version**: v1.0.0-dev

A modern, full-stack task management platform built with **Node.js**, **PostgreSQL**, **Express**, and **React**. Features real-time collaboration, comprehensive project management, and enterprise-grade security.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)

## 🎯 Project Overview

TaskFlow is a comprehensive task management solution designed for modern teams and individual productivity. It combines intuitive user experience with robust backend architecture, offering real-time collaboration features and enterprise-grade security.

### ✨ Key Features (Implemented & Planned)

#### 🔐 Authentication System ✅
- [x] JWT-based authentication
- [x] Secure password hashing (bcrypt)
- [x] User registration and login
- [x] Protected API endpoints
- [x] Token verification and refresh
- [x] **Comprehensive test coverage** 
- [ ] OAuth integration (Google, GitHub)
- [ ] Multi-factor authentication

#### 📊 Project Management (Planned)
- [ ] Create and manage projects
- [ ] Project member management
- [ ] Role-based permissions
- [ ] Project templates
- [ ] Project analytics

#### 📝 Task Management (Planned)
- [ ] CRUD operations for tasks
- [ ] Task assignments and due dates
- [ ] Priority levels and categories
- [ ] Task comments and attachments
- [ ] Kanban board interface
- [ ] Advanced filtering and search

#### ⚡ Real-time Features (Planned)
- [ ] Live task updates
- [ ] Real-time notifications
- [ ] Collaborative editing
- [ ] Activity feeds
- [ ] WebSocket integration

## 🏗️ Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│  (Node.js)      │◄──►│ (PostgreSQL)    │
│   [Planned]     │    │   [Active]      │    │   [Active]      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                    ┌─────────────────┐
                    │     Docker      │
                    │  [Configured]   │
                    └─────────────────┘
```

### 🛠️ Technology Stack

#### Backend (✅ Implemented)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Jest + Supertest ✅
- **Environment**: Docker containerization

#### Frontend (📅 Planned)
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand or Redux Toolkit
- **Real-time**: Socket.io client

#### DevOps & Infrastructure (🔄 Partially Implemented)
- **Containerization**: Docker + Docker Compose ✅
- **Database**: PostgreSQL with persistent volumes ✅
- **Testing**: Automated test suites ✅
- **Cache**: Redis for session management
- **CI/CD**: GitHub Actions pipeline (planned)
- **Deployment**: Vercel/Railway (planned)

## 📁 Project Structure

```
taskflow-platform/
├── backend/                    # Node.js Express API ✅
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   │   ├── authController.js ✅
│   │   │   ├── projectController.js ✅
│   │   │   └── taskController.js ✅
│   │   ├── middleware/         # Custom middleware
│   │   │   └── auth.js ✅
│   │   ├── routes/            # Express routes
│   │   │   ├── auth.js ✅
│   │   │   ├── projects.js ✅
│   │   │   └── tasks.js ✅
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── tests/             # Test suites ✅
│   │   │   ├── integration/   # API integration tests
│   │   │   └── utils/         # Test utilities
│   │   └── index.js ✅        # Main server file
│   ├── prisma/
│   │   └── schema.prisma ✅   # Database schema
│   ├── package.json ✅
│   └── .env ✅
├── frontend/                   # Next.js React app (planned)
├── docker-compose.yml ✅       # Multi-container setup
├── .github/workflows/         # CI/CD pipelines (planned)
└── README.md ✅
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MJ-Sarabando/taskflow-platform.git
   cd taskflow-platform
   ```

2. **Start with Docker (Recommended)**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d database redis
   
   # Verify services are running
   docker ps
   ```

3. **Setup Backend**
   ```bash
   cd backend
   
   # Install dependencies
   npm install
   
   # Setup environment variables
   cp .env.example .env
   # Edit .env with your configurations
   
   # Setup database
   npx prisma generate
   npx prisma db push
   
   # Start development server
   npm run dev
   ```

4. **Verify Installation**
   ```bash
   # Test API endpoints
   curl http://localhost:5000/health
   curl http://localhost:5000/api
   
   # Run test suite
   npm test
   ```

### 🔧 Environment Configuration

Create `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://taskflow_user:taskflow_password@localhost:5432/taskflow_dev"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

## 🧪 API Documentation

### Authentication Endpoints

| Endpoint | Method | Description | Status | Tests |
|----------|---------|-------------|--------|--------|
| `/api/auth/register` | POST | Register new user | ✅ | ✅ |
| `/api/auth/login` | POST | User authentication | ✅ | ✅ |
| `/api/auth/me` | GET | Get user profile | ✅ | ✅ |

### Projects & Tasks Endpoints

| Endpoint | Method | Description | Status |
|----------|---------|-------------|--------|
| `/api/projects` | GET | Get all user projects | ✅ |
| `/api/projects` | POST | Create new project | ✅ |
| `/api/projects/:id` | GET | Get project details | ✅ |
| `/api/projects/:id` | PUT | Update project | ✅ |
| `/api/projects/:id` | DELETE | Delete project | ✅ |
| `/api/tasks` | GET | Get tasks with filters | ✅ |
| `/api/tasks` | POST | Create new task | ✅ |
| `/api/tasks/:id` | GET | Get task details | ✅ |
| `/api/tasks/:id` | PUT | Update task | ✅ |
| `/api/tasks/:id` | DELETE | Delete task | ✅ |

### Example Usage

#### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

#### Access Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🗄️ Database Schema

Current implemented models:

- **User**: Authentication and profile information ✅
- **Project**: Project organization and management ✅
- **Task**: Individual work items with full lifecycle ✅
- **ProjectMember**: Team collaboration (schema ready)
- **Comment**: Task discussions (schema ready)

### Relationships Implemented:
- ✅ Users can own multiple Projects
- ✅ Projects can have multiple Tasks
- ✅ Tasks belong to Projects and can be assigned to Users
- ✅ Full CRUD operations with proper access control
- ✅ Data integrity with foreign key constraints

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** and sanitization
- **Rate Limiting** on API endpoints
- **CORS Configuration** for cross-origin requests
- **Security Headers** via Helmet.js
- **Environment Variable** protection

## 🧪 Testing

### Current Test Coverage ✅

**Authentication System**: **100% Pass Rate** (11/11 tests)

- ✅ User Registration
  - Valid user registration
  - Missing fields validation
  - Password length validation  
  - Duplicate email prevention

- ✅ User Authentication  
  - Successful login flow
  - Missing credentials validation
  - Invalid email handling
  - Invalid password handling

- ✅ Protected Routes
  - Authenticated user profile access
  - Token requirement validation
  - Invalid token handling

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test suite
npm test -- --testPathPattern=auth
```

### Test Results
```
✅ Authentication Endpoints: 11/11 tests passed
📊 Test Suites: 1 passed, 1 total
🕐 Execution Time: ~3.5 seconds
```

## 📊 Development Status

### Current Phase: Backend Foundation ✅ COMPLETED
- [x] Express server setup
- [x] PostgreSQL database integration
- [x] Prisma ORM configuration
- [x] JWT authentication system
- [x] User registration and login
- [x] API endpoint protection
- [x] Docker containerization
- [x] Basic error handling
- [x] **Comprehensive test suite** ✅

### Phase 2: Core APIs ✅ COMPLETED
- [x] Projects CRUD operations
- [x] Tasks CRUD operations
- [x] User profile management
- [x] Data relationships and associations
- [x] Advanced validation and error handling
- [x] Access control and permissions
- [x] Query filtering and sorting

### Current Phase: Testing & Quality Assurance ✅ IN PROGRESS
- [x] Authentication endpoint testing
- [ ] Projects API testing
- [ ] Tasks API testing
- [ ] Integration test coverage
- [ ] Error handling validation
- [ ] Performance testing

### Phase 3: Advanced Features (Planned)
- [ ] Project member management
- [ ] Task comments system
- [ ] File upload functionality
- [ ] Real-time notifications

### Future Phases
- [ ] Frontend development (Next.js)
- [ ] Real-time features (WebSocket)
- [ ] File upload functionality
- [ ] Advanced search and filtering
- [ ] Notification system
- [ ] Mobile responsiveness
- [ ] Testing automation
- [ ] CI/CD pipeline
- [ ] Production deployment

## 🚀 Deployment

Deployment configurations for various platforms:

- **Development**: Local Docker environment ✅
- **Testing**: Isolated test database ✅
- **Staging**: Docker containers (planned)
- **Production**: Cloud deployment (planned)

## 🤝 Contributing

This is currently a personal learning project. Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Log

### Recent Updates
- **2025-08-07**: ✅ **TESTING MILESTONE** - Authentication test suite implemented and passing
- **2025-08-07**: ✅ Complete integration test coverage for auth endpoints
- **2025-08-07**: ✅ Test environment configuration with Docker
- **2025-08-07**: ✅ Supertest integration for API testing
- **2025-08-06**: ✅ **MAJOR MILESTONE** - Complete CRUD APIs implemented
- **2025-08-06**: ✅ Projects management system with full CRUD operations
- **2025-08-06**: ✅ Tasks management system with advanced filtering
- **2025-08-06**: ✅ Data relationships between Users, Projects, and Tasks
- **2025-08-06**: ✅ Access control and permissions system
- **2025-08-06**: ✅ Comprehensive API testing completed
- **2025-08-06**: ✅ Backend architecture finalized and production-ready
- **2025-08-06**: ✅ Implemented complete JWT authentication system
- **2025-08-06**: ✅ Created PostgreSQL database schema
- **2025-08-06**: ✅ Setup Docker development environment
- **2025-08-06**: ✅ Configured Express server with security middleware

### Upcoming
- Projects and Tasks API testing
- Frontend development kickoff
- Real-time features implementation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Maria Joao Sarabando**
- GitHub: [@MJ-Sarabando](https://github.com/MJ-Sarabando)
- LinkedIn: [maria-sarabando](https://www.linkedin.com/in/maria-sarabando)
- Portfolio: [Coming Soon]

---

⭐ **If you find this project interesting, please consider giving it a star!** ⭐

*Built with passion for modern web development and collaborative productivity tools.* 🚀