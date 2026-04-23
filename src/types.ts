export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null; // ISO date string YYYY-MM-DD
  tags: string[];
  createdAt: string; // ISO datetime
  completedAt: string | null;
}

export interface FilterState {
  status: FilterStatus;
  priority: Priority | 'all';
  tag: string | null;
  search: string;
}
