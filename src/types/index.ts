export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "Low" | "Medium" | "High";

export interface TaskType {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
  currentProgress?: number;
  updateCount?: number;
  latestUpdatePreview?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface ProjectType {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}
