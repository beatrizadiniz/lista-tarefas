export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  categoryId?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = "ALL" | "PENDING" | "COMPLETED";

export type SortType = "ORDER" | "PRIORITY" | "DUE_DATE" | "CREATED_AT";

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: "ALTA",
  MEDIUM: "MÉDIA",
  LOW: "BAIXA",
};

export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Trabalho", color: "var(--color-category-work)", icon: "briefcase" },
  { name: "Pessoal", color: "var(--color-category-personal)", icon: "user" },
  { name: "Estudos", color: "var(--color-category-studies)", icon: "book-open" },
  { name: "Saúde", color: "var(--color-category-health)", icon: "heart" },
  { name: "Outro", color: "var(--color-category-other)", icon: "more-horizontal" },
];