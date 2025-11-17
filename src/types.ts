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
  clientId?: ID;
  budget?: number;
};

export type Member = {
  id: ID;
  name: string;
  email?: string;
  avatar?: string;
  hourlyRate?: number;
  role?: string;
};

export type Client = {
  id: ID;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  createdAt: string;
};

export type TimeEntry = {
  id: ID;
  taskId: ID;
  memberId: ID;
  hours: number;
  date: string;
  description?: string;
  billable: boolean;
  createdAt: string;
};

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  avgProgress: number;
  totalRevenue: number;
  totalHours: number;
  utilizationRate: number;
}
