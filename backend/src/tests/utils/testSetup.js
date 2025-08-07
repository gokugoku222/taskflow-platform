/**
 * Test Setup Utilities
 * Common functions for testing environment
 */
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Use test database URL or in-memory
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
    }
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

/**
 * Clean database before each test
 */
const cleanDatabase = async () => {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
};

/**
 * Create test user
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const user = { ...defaultUser, ...userData };
  const hashedPassword = await bcrypt.hash(user.password, 12);

  return await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword
    }
  });
};

/**
 * Create test project
 */
const createTestProject = async (ownerId, projectData = {}) => {
  const defaultProject = {
    name: 'Test Project',
    description: 'Test project description',
    color: '#3B82F6'
  };

  const project = { ...defaultProject, ...projectData };

  return await prisma.project.create({
    data: {
      ...project,
      ownerId
    }
  });
};

/**
 * Create test task
 */
const createTestTask = async (projectId, creatorId, taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test task description',
    priority: 'MEDIUM'
  };

  const task = { ...defaultTask, ...taskData };

  return await prisma.task.create({
    data: {
      ...task,
      projectId,
      creatorId
    }
  });
};

/**
 * Generate JWT token for testing
 */
const generateTestToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Setup test database
 */
const setupTestDatabase = async () => {
  await cleanDatabase();
};

/**
 * Teardown test database
 */
const teardownTestDatabase = async () => {
  await cleanDatabase();
  await prisma.$disconnect();
};

module.exports = {
  prisma,
  cleanDatabase,
  createTestUser,
  createTestProject,
  createTestTask,
  generateTestToken,
  setupTestDatabase,
  teardownTestDatabase
};
