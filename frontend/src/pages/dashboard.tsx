import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/Card';
import { 
  Plus, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  TrendingUp,
  AlertCircle,
  Calendar,
  MoreHorizontal,
  Bell,
  LogOut,
  User
} from 'lucide-react';
import { useRouter } from 'next/router';
import { Project } from '@/types/project';
import { formatDate } from '@/lib/utils';

// [... rest of the components stay the same ...]
// Dashboard Header Component
function DashboardHeader() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600">TaskFlow</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Project Card Component (unchanged)
interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const priorityColors = {
  LOW: 'text-green-600 bg-green-100',
  MEDIUM: 'text-yellow-600 bg-yellow-100',
  HIGH: 'text-red-600 bg-red-100',
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {project.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              {priorityLabels[project.priority]}
            </span>
            
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(project.createdAt)}
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => onDelete(project.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Create Project Modal (unchanged)
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => Promise<void>;
}

function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description || undefined,
        priority: formData.priority
      });
      setFormData({ name: '', description: '', priority: 'MEDIUM' });
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Project description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Dashboard Page with Footer
export default function DashboardPage() {
  const { user } = useAuthStore();
  const { projects, isLoading, fetchProjects, createProject, deleteProject } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (data: {
    name: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }) => {
    await createProject(data);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Pending Tasks',
      value: '23',
      icon: CheckSquare,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      title: 'Team Members',
      value: '5',
      icon: Users,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Productivity',
      value: '85%',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const recentProjects = projects.slice(0, 6);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">
                Here's an overview of your projects and recent activities.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`rounded-lg p-2 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Projects
                    </h2>
                    <p className="text-sm text-gray-600">
                      Manage your projects and track progress
                    </p>
                  </div>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : recentProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={handleDeleteProject}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No projects found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first project.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  </div>
                )}

                {recentProjects.length > 0 && projects.length > 6 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => router.push('/projects')}>
                      View All Projects ({projects.length})
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">
                      You created project "TaskFlow Platform" 2 hours ago
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">
                      New task "Implement authentication" was added
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">
                      Project "Website Redesign" was updated
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="p-4 h-auto flex-col"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Create Project</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-4 h-auto flex-col"
                    onClick={() => router.push('/tasks')}
                  >
                    <CheckSquare className="h-6 w-6 mb-2" />
                    <span>New Task</span>
                  </Button>
                  <Button variant="outline" className="p-4 h-auto flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Invite Team</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer with your name and copyright */}
        <Footer />

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    </ProtectedRoute>
  );
}
