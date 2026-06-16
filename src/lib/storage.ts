import type { Task, Category } from "@/features/todo/types";

const STORAGE_KEYS = {
  tasks: "todo:tasks",
  categories: "todo:categories",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

export const storage = {
  getTasks(): Task[] {
    return getItem<Task[]>(STORAGE_KEYS.tasks, []);
  },

  setTasks(tasks: Task[]): void {
    setItem(STORAGE_KEYS.tasks, tasks);
  },

  getCategories(): Category[] {
    return getItem<Category[]>(STORAGE_KEYS.categories, []);
  },

  setCategories(categories: Category[]): void {
    setItem(STORAGE_KEYS.categories, categories);
  },
};