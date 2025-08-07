const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Initialize Express app and Prisma
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const prisma = new PrismaClient();

const authRoutes = require('./routes/auth');
console.log('✅ Auth routes loaded');
const projectRoutes = require('./routes/projects');
console.log('✅ Project routes loaded');
const taskRoutes = require('./routes/tasks');
console.log('✅ Task routes loaded');

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered at /api/auth');
app.use('/api/projects', projectRoutes);
console.log('✅ Project routes registered at /api/projects');
app.use('/api/tasks', taskRoutes);
console.log('✅ Task routes registered at /api/tasks');

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TaskFlow API is running!',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: NODE_ENV === 'development' ? error : 'Database connection failed'
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'TaskFlow API v1.0.0',
    endpoints: {
      health: '/health',
      // Authentication
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me (requires Bearer token)',
      verify: 'POST /api/auth/verify',
      // Projects
      projects: 'GET /api/projects (requires auth)',
      createProject: 'POST /api/projects (requires auth)',
      projectDetails: 'GET /api/projects/:id (requires auth)',
      updateProject: 'PUT /api/projects/:id (requires auth)',
      deleteProject: 'DELETE /api/projects/:id (requires auth)',
      // Tasks
      tasks: 'GET /api/tasks (requires auth)',
      createTask: 'POST /api/tasks (requires auth)',
      taskDetails: 'GET /api/tasks/:id (requires auth)',
      updateTask: 'PUT /api/tasks/:id (requires auth)',
      deleteTask: 'DELETE /api/tasks/:id (requires auth)'
    },
    status: 'Full CRUD API ready! 🚀'
  });
});

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log('🚀 TaskFlow Backend Server Started!');
      console.log(`📊 Environment: ${NODE_ENV}`);
      console.log(`🔗 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log('🔐 Auth endpoints: /api/auth/register, /api/auth/login');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Export app and prisma for testing
module.exports = { app, prisma };

// Only start server if not in test environment
if (NODE_ENV !== 'test') {
  startServer();
}
