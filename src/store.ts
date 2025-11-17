import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Project, Task, Member, ID, Priority, ProjectStats } from './types';

interface AppState {
  projects: Project[];
  tasks: Task[];
  members: Member[];
  
  addProject: (name: string, description?: string, dueDate?: string) => void;
  updateProject: (id: ID, patch: Partial<Project>) => void;
  deleteProject: (id: ID) => void;
  
  addTask: (projectId: ID, name: string, assigneeId?: ID, priority?: Priority, dueDate?: string) => void;
  toggleTask: (id: ID) => void;
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, patch: Partial<Task>) => void;
  reorderTasks: (projectId: ID, taskIds: ID[]) => void;
  
  addMember: (name: string, email?: string) => void;
  updateMember: (id: ID, name: string) => void;
  deleteMember: (id: ID) => void;
  
  getProjectTasks: (projectId: ID) => Task[];
  getProjectProgress: (projectId: ID) => number;
  getMemberTaskCount: (memberId: ID) => number;
  getMemberCapacity: (memberId: ID) => number;
  getProjectStats: () => ProjectStats;
  getBestAssignee: (projectId: ID) => ID | undefined;
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days: number) => Task[];
}

const initialMembers: Member[] = [
  { id: nanoid(), name: 'Alice Johnson', email: 'alice@company.com' },
  { id: nanoid(), name: 'Bob Smith', email: 'bob@company.com' },
  { id: nanoid(), name: 'Carol Davis', email: 'carol@company.com' },
  { id: nanoid(), name: 'David Wilson', email: 'david@company.com' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      tasks: [],
      members: initialMembers,

      addProject: (name: string, description?: string, dueDate?: string) => {
        const newProject: Project = {
          id: nanoid(),
          name,
          status: 'Not Started',
          progress: 0,
          description,
          dueDate,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id: ID, patch: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        }));
      },

      deleteProject: (id: ID) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
        }));
      },

      addTask: (projectId: ID, name: string, assigneeId?: ID, priority: Priority = 'medium', dueDate?: string) => {
        const projectTasks = get().tasks.filter(t => t.projectId === projectId);
        const maxOrder = projectTasks.length > 0 ? Math.max(...projectTasks.map(t => t.order)) : -1;

        const newTask: Task = {
          id: nanoid(),
          name,
          complete: false,
          assigneeId,
          projectId,
          priority,
          dueDate,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        
        const project = get().projects.find(p => p.id === projectId);
        if (project && project.status === 'Not Started') {
          get().updateProject(projectId, { status: 'In Progress' });
        }

        const progress = get().getProjectProgress(projectId);
        get().updateProject(projectId, { progress });
      },

      toggleTask: (id: ID) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, complete: !t.complete } : t
          ),
        }));
        
        const task = get().tasks.find(t => t.id === id);
        if (task) {
          const projectTasks = get().getProjectTasks(task.projectId);
          const allComplete = projectTasks.every(t => t.complete);
          const project = get().projects.find(p => p.id === task.projectId);
          const progress = get().getProjectProgress(task.projectId);
          
          if (allComplete && projectTasks.length > 0) {
            get().updateProject(task.projectId, { status: 'Completed', progress: 100 });
          } else if (project?.status === 'Completed') {
            get().updateProject(task.projectId, { status: 'In Progress', progress });
          } else {
            get().updateProject(task.projectId, { progress });
          }
        }
      },

      deleteTask: (id: ID) => {
        const task = get().tasks.find(t => t.id === id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        
        if (task) {
          const progress = get().getProjectProgress(task.projectId);
          get().updateProject(task.projectId, { progress });
        }
      },

      updateTask: (id: ID, patch: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        }));
      },

      reorderTasks: (projectId: ID, taskIds: ID[]) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.projectId === projectId) {
              const newOrder = taskIds.indexOf(task.id);
              return newOrder !== -1 ? { ...task, order: newOrder } : task;
            }
            return task;
          }),
        }));
      },

      addMember: (name: string, email?: string) => {
        const newMember: Member = {
          id: nanoid(),
          name,
          email,
        };
        set((state) => ({ members: [...state.members, newMember] }));
      },

      updateMember: (id: ID, name: string) => {
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, name } : m
          ),
        }));
      },

      deleteMember: (id: ID) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          tasks: state.tasks.map((t) =>
            t.assigneeId === id ? { ...t, assigneeId: undefined } : t
          ),
        }));
      },

      getProjectTasks: (projectId: ID) => {
        return get().tasks.filter((t) => t.projectId === projectId).sort((a, b) => a.order - b.order);
      },

      getProjectProgress: (projectId: ID) => {
        const tasks = get().tasks.filter((t) => t.projectId === projectId);
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter((t) => t.complete).length;
        return Math.round((completedTasks / tasks.length) * 100);
      },

      getMemberTaskCount: (memberId: ID) => {
        return get().tasks.filter((t) => t.assigneeId === memberId && !t.complete).length;
      },

      getMemberCapacity: (memberId: ID) => {
        const taskCount = get().getMemberTaskCount(memberId);
        return Math.min((taskCount / 5) * 100, 100);
      },

      getProjectStats: (): ProjectStats => {
        const state = get();
        const activeProjects = state.projects.filter(p => p.status === 'In Progress').length;
        const completedProjects = state.projects.filter(p => p.status === 'Completed').length;
        const completedTasks = state.tasks.filter(t => t.complete).length;
        const avgProgress = state.projects.length > 0 
          ? state.projects.reduce((sum, p) => sum + p.progress, 0) / state.projects.length 
          : 0;
        const overdueTasks = get().getOverdueTasks().length;

        return {
          totalProjects: state.projects.length,
          activeProjects,
          completedProjects,
          totalTasks: state.tasks.length,
          completedTasks,
          overdueTasks,
          avgProgress: Math.round(avgProgress),
        };
      },

      getBestAssignee: (_projectId: ID) => {
        const members = get().members;
        if (members.length === 0) return undefined;

        const memberLoads = members.map(member => ({
          id: member.id,
          load: get().getMemberTaskCount(member.id),
        }));

        memberLoads.sort((a, b) => a.load - b.load);
        return memberLoads[0].id;
      },

      getOverdueTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter(task => 
          !task.complete && task.dueDate && task.dueDate < today
        );
      },

      getUpcomingTasks: (days: number) => {
        const today = new Date();
        const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        
        return get().tasks.filter(task => 
          !task.complete && task.dueDate && task.dueDate >= todayStr && task.dueDate <= futureDate
        );
      },
    }),
    {
      name: 'vznx-storage',
    }
  )
);
