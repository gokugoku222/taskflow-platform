import { create } from 'zustand';

interface Project {
  id: string;
  name: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: { name: string; description?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulação - substituir pela chamada real da API
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Projeto Exemplo',
          description: 'Descrição do projeto exemplo',
          priority: 'HIGH',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: '1'
        }
      ];
      set({ projects: mockProjects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  createProject: async (data) => {
    try {
      // Simulação - substituir pela chamada real da API
      const newProject: Project = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: '1'
      };
      set({ projects: [...get().projects, newProject] });
    } catch (error) {
      set({ error: 'Failed to create project' });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      // Simulação - substituir pela chamada real da API
      set({ projects: get().projects.filter(p => p.id !== id) });
    } catch (error) {
      set({ error: 'Failed to delete project' });
      throw error;
    }
  },
}));
