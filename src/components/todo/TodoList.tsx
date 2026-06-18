"use client";

import { TodoItem } from "./TodoItem";
import type { Task, Category, FilterType } from "@/features/todo/types";

interface TodoListProps {
  tasks: Task[];
  categories: Category[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const emptyMessages: Record<FilterType, { title: string; description: string; emoji: string }> = {
  ALL: {
    title: "Nenhuma tarefa ainda",
    description: "Clique em \"Adicionar nova tarefa\" para começar",
    emoji: "✨",
  },
  PENDING: {
    title: "Nenhuma tarefa pendente",
    description: "Você está em dia com tudo! Parabéns 🎉",
    emoji: "🎯",
  },
  COMPLETED: {
    title: "Nenhuma tarefa concluída",
    description: "Marque tarefas como concluídas para vê-las aqui",
    emoji: "☑️",
  },
};

export function TodoList({ tasks, categories, filter, onToggle, onDelete, onEdit }: TodoListProps) {
  if (tasks.length === 0) {
    const msg = emptyMessages[filter];

    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        {/* Illustrated empty state */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-[var(--radius-xl)] flex items-center justify-center text-4xl shadow-[var(--shadow-card)]"
            style={{ background: "var(--gradient-surface)", border: "1px solid var(--color-border)" }}
          >
            {msg.emoji}
          </div>
          {/* Decorative dots */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-60"
            style={{ background: "var(--gradient-accent)" }} />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full opacity-40"
            style={{ background: "var(--gradient-accent)" }} />
        </div>

        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">
          {msg.title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">
          {msg.description}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <TodoItem
            task={task}
            category={categories.find((c) => c.id === task.categoryId)}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}