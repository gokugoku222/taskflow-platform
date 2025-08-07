/**
 * Tasks Routes
 * /api/tasks/*
 */
const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware.authenticateToken);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filters
 * @access  Private
 * @query   projectId, status, priority, assigneeId, dueDate
 */
router.get('/', taskController.getTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private
 */
router.post('/', taskController.createTask);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private
 */
router.get('/:id', taskController.getTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id', taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private (Project Owner/Admin)
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
