/**
 * Projects Routes
 * /api/projects/*
 */
const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware.authenticateToken);

/**
 * @route   GET /api/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
router.get('/', projectController.getProjects);

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', projectController.createProject);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', projectController.getProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Project Owner)
 */
router.put('/:id', projectController.updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Project Owner)
 */
router.delete('/:id', projectController.deleteProject);

module.exports = router;
