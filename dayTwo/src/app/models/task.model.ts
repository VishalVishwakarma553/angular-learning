export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Assignee;
  estimateHours: number;
  tags: string[];
  createdAt: Date;
}

export interface ColumnConfig {
  id: TaskStatus;
  title: string;
  accentColor: string;
  description: string;
}
