"use client";

import { useState, useCallback, useEffect } from "react";
import type { Task, Category, FilterType, Priority, TodoStats } from "@/features/todo/types";
import { generateId, getPriorityWeight } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/features/todo/types";
import { supabase } from "@/lib/supabase";

interface UseTodosReturn {
  tasks: Task[];
  categories: Category[];
  filter: FilterType;
  search: string;
  stats: TodoStats;
  filteredTasks: Task[];
  setFilter: (filter: FilterType) => void;
  setSearch: (search: string) => void;
  addTask: (task: Pick<Task, "title" | "priority" | "dueDate" | "categoryId" | "description">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  reorderTasks: (tasks: Task[]) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  isLoading: boolean;
}

export function useTodos(): UseTodosReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [search, setSearchState] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Carregar dados do Supabase
  const loadData = useCallback(async (currentUserId: string) => {
    setIsLoading(true);
    try {
      // Buscar categorias do usuário logado
      let { data: fetchedCategories, error: catError } = await supabase
        .from("Category")
        .select("*")
        .eq("userId", currentUserId)
        .order("order", { ascending: true });

      if (catError) throw catError;

      if (!fetchedCategories || fetchedCategories.length === 0) {
        const defaultCats = getDefaultCategories();
        const { data: insertedCats, error: insertCatError } = await supabase
          .from("Category")
          .insert(defaultCats.map(cat => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            icon: cat.icon || null,
            userId: currentUserId
          })))
          .select();

        if (insertCatError) throw insertCatError;
        fetchedCategories = insertedCats;
      }

      const formattedCategories: Category[] = (fetchedCategories || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon || undefined,
        userId: cat.userId
      }));

      setCategories(formattedCategories);

      // Buscar tarefas do usuário logado
      let { data: fetchedTasks, error: taskError } = await supabase
        .from("Task")
        .select("*")
        .eq("userId", currentUserId)
        .order("order", { ascending: true });

      if (taskError) throw taskError;

      const formattedTasks: Task[] = (fetchedTasks || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        completed: task.completed,
        priority: task.priority as Priority,
        dueDate: task.dueDate || undefined,
        categoryId: task.categoryId || undefined,
        order: task.order,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        userId: task.userId
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error("Erro ao carregar dados do Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Monitorar autenticação e gerenciar sessão inicial
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (session?.user) {
        setUserId(session.user.id);
        await loadData(session.user.id);
      } else {
        setUserId(null);
        setTasks([]);
        setCategories([]);
        setIsLoading(false);
      }
    }

    initSession();

    // Escutar mudanças no estado de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setUserId(session.user.id);
          await loadData(session.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setTasks([]);
        setCategories([]);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadData]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
  }, []);

  const stats: TodoStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter((t) => t.priority === "HIGH" && !t.completed).length,
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "PENDING") return !task.completed;
      if (filter === "COMPLETED") return task.completed;
      return true;
    })
    .filter((task) =>
      search
        ? task.title.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const weightDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      if (weightDiff !== 0) return weightDiff;
      return a.order - b.order;
    });

  const addTask = useCallback(
    async (data: Pick<Task, "title" | "priority" | "dueDate" | "categoryId" | "description">) => {
      if (!userId) return;
      const now = new Date().toISOString();
      const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order), -1);
      const newTask: Task = {
        id: generateId(),
        title: data.title,
        description: data.description || undefined,
        completed: false,
        priority: data.priority || "MEDIUM",
        dueDate: data.dueDate || undefined,
        categoryId: data.categoryId || undefined,
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
        userId: userId,
      };

      setTasks((prev) => [newTask, ...prev]);

      const { error } = await supabase.from("Task").insert({
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || null,
        completed: newTask.completed,
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        categoryId: newTask.categoryId || null,
        order: newTask.order,
        createdAt: newTask.createdAt,
        updatedAt: newTask.updatedAt,
        userId: newTask.userId,
      });

      if (error) {
        console.error("Erro ao adicionar tarefa no Supabase:", error);
        setTasks((prev) => prev.filter((t) => t.id !== newTask.id));
      }
    },
    [tasks, userId]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      if (!userId) return;
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const newCompleted = !task.completed;
      const now = new Date().toISOString();

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: newCompleted, updatedAt: now } : t
        )
      );

      const { error } = await supabase
        .from("Task")
        .update({ completed: newCompleted, updatedAt: now })
        .eq("id", id);

      if (error) {
        console.error("Erro ao alterar tarefa no Supabase:", error);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: !newCompleted, updatedAt: task.updatedAt } : t
          )
        );
      }
    },
    [tasks, userId]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!userId) return;
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      setTasks((prev) => prev.filter((t) => t.id !== id));

      const { error } = await supabase.from("Task").delete().eq("id", id);
      if (error) {
        console.error("Erro ao deletar tarefa no Supabase:", error);
        setTasks((prev) => [...prev, task].sort((a, b) => a.order - b.order));
      }
    },
    [tasks, userId]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      if (!userId) return;
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const now = new Date().toISOString();
      const updatedFields = {
        ...updates,
        updatedAt: now,
      };

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
      );

      const { error } = await supabase
        .from("Task")
        .update({
          title: updates.title,
          description: updates.description !== undefined ? (updates.description || null) : undefined,
          priority: updates.priority,
          dueDate: updates.dueDate !== undefined ? (updates.dueDate || null) : undefined,
          categoryId: updates.categoryId !== undefined ? (updates.categoryId || null) : undefined,
          completed: updates.completed,
          order: updates.order,
          updatedAt: now,
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar tarefa no Supabase:", error);
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? task : t))
        );
      }
    },
    [tasks, userId]
  );

  const reorderTasks = useCallback(
    async (reordered: Task[]) => {
      if (!userId) return;
      setTasks(reordered);

      const promises = reordered.map((t, idx) =>
        supabase.from("Task").update({ order: idx }).eq("id", t.id)
      );

      const results = await Promise.all(promises);
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        console.error("Erro ao reordenar tarefas no Supabase:", errors);
      }
    },
    [userId]
  );

  const addCategory = useCallback(
    async (name: string, color: string) => {
      if (!userId) return;
      const newCat: Category = {
        id: generateId(),
        name,
        color,
        userId: userId,
      };

      setCategories((prev) => [...prev, newCat]);

      const { error } = await supabase.from("Category").insert({
        id: newCat.id,
        name: newCat.name,
        color: newCat.color,
        userId: newCat.userId,
      });
      if (error) {
        console.error("Erro ao adicionar categoria no Supabase:", error);
        setCategories((prev) => prev.filter((c) => c.id !== newCat.id));
      }
    },
    [userId]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!userId) return;
      const category = categories.find((c) => c.id === id);
      if (!category) return;

      const previousTasks = [...tasks];

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setTasks((prev) =>
        prev.map((t) => (t.categoryId === id ? { ...t, categoryId: undefined } : t))
      );

      const { error } = await supabase.from("Category").delete().eq("id", id);
      if (error) {
        console.error("Erro ao deletar categoria no Supabase:", error);
        setCategories((prev) => [...prev, category]);
        setTasks(previousTasks);
      }
    },
    [categories, tasks, userId]
  );

  return {
    tasks,
    categories,
    filter,
    search,
    stats,
    filteredTasks,
    setFilter,
    setSearch,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    addCategory,
    deleteCategory,
    isLoading,
  };
}

function getDefaultCategories(): Category[] {
  return DEFAULT_CATEGORIES.map((cat) => ({
    id: generateId(),
    name: cat.name,
    color: cat.color,
    icon: cat.icon || undefined,
  }));
}
