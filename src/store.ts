import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Project, Task, Member, ID } from './types';

interface AppState {
  projects: Project[];
  tasks: Task[];
  members: Member[];
  
  addProject: (name: string) => void;
  updateProject: (id: ID, patch: Partial<Project>) => void;
  deleteProject: (id: ID) => void;
  
  addTask: (projectId: ID, name: string, assigneeId?: ID) => void;
  toggleTask: (id: ID) => void;
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, patch: Partial<Task>) => void;
  
  addMember: (name: string) => void;
  updateMember: (id: ID, name: string) => void;
  deleteMember: (id: ID) => void;
  
  getProjectTasks: (projectId: ID) => Task[];
  getProjectProgress: (projectId: ID) => number;
  getMemberTaskCount: (memberId: ID) => number;
  getMemberCapacity: (memberId: ID) => number;
}

const initialMembers: Member[] = [
  { id: nanoid(), name: 'Alice Johnson' },
  { id: nanoid(), name: 'Bob Smith' },
  { id: nanoid(), name: 'Carol Davis' },
  { id: nanoid(), name: 'David Wilson' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      tasks: [],
      members: initialMembers,

      addProject: (name: string) => {
        const newProject: Project = {
          id: nanoid(),
          name,
          status: 'Not Started',
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

      addTask: (projectId: ID, name: string, assigneeId?: ID) => {
        const newTask: Task = {
          id: nanoid(),
          name,
          complete: false,
          assigneeId,
          projectId,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        
        const project = get().projects.find(p => p.id === projectId);
        if (project && project.status === 'Not Started') {
          get().updateProject(projectId, { status: 'In Progress' });
        }
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
          
          if (allComplete && projectTasks.length > 0) {
            get().updateProject(task.projectId, { status: 'Completed' });
          } else if (project?.status === 'Completed') {
            get().updateProject(task.projectId, { status: 'In Progress' });
          }
        }
      },

      deleteTask: (id: ID) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      updateTask: (id: ID, patch: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        }));
      },

      addMember: (name: string) => {
        const newMember: Member = {
          id: nanoid(),
          name,
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
        return get().tasks.filter((t) => t.projectId === projectId);
      },

      getProjectProgress: (projectId: ID) => {
        const tasks = get().getProjectTasks(projectId);
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
    }),
    {
      name: 'vznx-storage',
    }
  )
);
