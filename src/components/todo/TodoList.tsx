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

export function TodoList({ tasks, categories, filter, onToggle, onDelete, onEdit }: TodoListProps) {
  if (tasks.length === 0) {
    const emptyMessages: Record<FilterType, { title: string; description: string }> = {
      ALL: {
        title: "Nenhuma tarefa encontrada",
        description: "Clique em \"Nova Tarefa\" para começar",
      },
      PENDING: {
        title: "Nenhuma tarefa pendente",
        description: "Todas as tarefas foram concluídas! 🎉",
      },
      COMPLETED: {
        title: "Nenhuma tarefa concluída",
        description: "Marque tarefas como concluídas para vê-las aqui",
      },
    };

    const msg = emptyMessages[filter];

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
          {msg.title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          {msg.description}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          category={categories.find((c) => c.id === task.categoryId)}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}