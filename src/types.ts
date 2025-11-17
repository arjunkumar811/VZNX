export type ID = string;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: ID;
  name: string;
  complete: boolean;
  assigneeId?: ID;
  projectId: ID;
  priority: Priority;
  dueDate?: string;
  order: number;
  createdAt: string;
};

export type Project = {
  id: ID;
  name: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number;
  description?: string;
  dueDate?: string;
  createdAt: string;
};

export type Member = {
  id: ID;
  name: string;
  email?: string;
  avatar?: string;
};

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  avgProgress: number;
}
