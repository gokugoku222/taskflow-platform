/**
 * Projects Controller - CRUD Operations
 * Handles project creation, management, and team collaboration
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all projects for authenticated user
 * GET /api/projects
 */
const getProjects = async (req, res) => {
  try {
    const userId = req.userId;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        tasks: {
          select: { 
            id: true, 
            title: true, 
            status: true, 
            priority: true,
            dueDate: true 
          }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      projects,
      total: projects.length
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get single project by ID
 * GET /api/projects/:id
 */
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true }
            },
            creator: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { comments: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Create new project
 * POST /api/projects
 */
const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.userId;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Project name is required'
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        error: 'Project name must be less than 100 characters'
      });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#3B82F6',
        ownerId: userId
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Update project
 * PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, status } = req.body;
    const userId = req.userId;

    // Check if user owns the project
    const existingProject = await prisma.project.findFirst({
      where: { id, ownerId: userId }
    });

    if (!existingProject) {
      return res.status(404).json({
        error: 'Project not found or access denied'
      });
    }

    // Validation
    if (name && name.trim().length === 0) {
      return res.status(400).json({
        error: 'Project name cannot be empty'
      });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (color) updateData.color = color;
    if (status && ['ACTIVE', 'ARCHIVED', 'COMPLETED'].includes(status)) {
      updateData.status = status;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Delete project
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if user owns the project
    const existingProject = await prisma.project.findFirst({
      where: { id, ownerId: userId }
    });

    if (!existingProject) {
      return res.status(404).json({
        error: 'Project not found or access denied'
      });
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
