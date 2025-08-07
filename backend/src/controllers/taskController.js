/**
 * Tasks Controller - CRUD Operations
 * Handles task creation, assignment, and lifecycle management
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all tasks (with filters)
 * GET /api/tasks?projectId=X&status=Y&assigneeId=Z
 */
const getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId, status, priority, assigneeId, dueDate } = req.query;

    // Build filter conditions
    const whereConditions = {
      project: {
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      }
    };

    // Add filters if provided
    if (projectId) whereConditions.projectId = projectId;
    if (status) whereConditions.status = status;
    if (priority) whereConditions.priority = priority;
    if (assigneeId) whereConditions.assigneeId = assigneeId;
    if (dueDate) {
      const targetDate = new Date(dueDate);
      whereConditions.dueDate = {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999))
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereConditions,
      include: {
        project: {
          select: { id: true, name: true, color: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      tasks,
      total: tasks.length,
      filters: {
        projectId,
        status,
        priority,
        assigneeId,
        dueDate
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          OR: [
            { ownerId: userId },
            { 
              members: {
                some: { userId: userId }
              }
            }
          ]
        }
      },
      include: {
        project: {
          select: { id: true, name: true, color: true, ownerId: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Create new task
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, priority, dueDate } = req.body;
    const userId = req.userId;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: 'Task title is required'
      });
    }

    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID is required'
      });
    }

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found or access denied'
      });
    }

    // Validate assignee if provided
    if (assigneeId) {
      const assignee = await prisma.user.findFirst({
        where: {
          id: assigneeId,
          OR: [
            { id: project.ownerId },
            {
              projectMembers: {
                some: { projectId: projectId }
              }
            }
          ]
        }
      });

      if (!assignee) {
        return res.status(400).json({
          error: 'Assignee must be project owner or member'
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        projectId,
        assigneeId: assigneeId || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        creatorId: userId
      },
      include: {
        project: {
          select: { id: true, name: true, color: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    const userId = req.userId;

    // Check if user has access to the task
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          OR: [
            { ownerId: userId },
            { 
              members: {
                some: { userId: userId }
              }
            }
          ]
        }
      },
      include: {
        project: true
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found or access denied'
      });
    }

    // Validation
    if (title && title.trim().length === 0) {
      return res.status(400).json({
        error: 'Task title cannot be empty'
      });
    }

    // Validate assignee if provided
    if (assigneeId !== undefined) {
      if (assigneeId && assigneeId !== existingTask.assigneeId) {
        const assignee = await prisma.user.findFirst({
          where: {
            id: assigneeId,
            OR: [
              { id: existingTask.project.ownerId },
              {
                projectMembers: {
                  some: { projectId: existingTask.projectId }
                }
              }
            ]
          }
        });

        if (!assignee) {
          return res.status(400).json({
            error: 'Assignee must be project owner or member'
          });
        }
      }
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status && ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].includes(status)) {
      updateData.status = status;
    }
    if (priority && ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(priority)) {
      updateData.priority = priority;
    }
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { id: true, name: true, color: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { comments: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if user has access to delete the task
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          OR: [
            { ownerId: userId },
            { 
              AND: [
                {
                  members: {
                    some: { 
                      userId: userId,
                      role: { in: ['ADMIN', 'OWNER'] }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found or access denied'
      });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
