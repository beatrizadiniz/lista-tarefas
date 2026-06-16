"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate, isExpired, isToday } from "@/lib/utils";
import { PRIORITY_LABELS } from "@/features/todo/types";
import type { Task, Category, Priority } from "@/features/todo/types";

interface TodoItemProps {
  task: Task;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityConfig: Record<Priority, { variant: "danger" | "warning" | "info"; label: string }> = {
  HIGH: { variant: "danger", label: "ALTA" },
  MEDIUM: { variant: "warning", label: "MÉDIA" },
  LOW: { variant: "info", label: "BAIXA" },
};

export function TodoItem({ task, category, onToggle, onDelete, onEdit }: TodoItemProps) {
  const priority = priorityConfig[task.priority];
  const expired = task.dueDate && isExpired(task.dueDate) && !task.completed;
  const today = task.dueDate && isToday(task.dueDate) && !task.completed;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-[var(--radius-lg)]",
        "bg-[var(--color-surface)] border border-[var(--color-border)]",
        "transition-all duration-150 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)]",
        task.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="pt-0.5"
      />

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "text-sm font-medium text-[var(--color-text-primary)] leading-snug",
              task.completed && "line-through text-[var(--color-text-muted)]"
            )}
          >
            {task.title}
          </h3>

          <button
            onClick={() => onDelete(task.id)}
            className="shrink-0 p-1.5 rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 focus:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-all"
            aria-label={`Excluir tarefa ${task.title}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={priority.variant}>{priority.label}</Badge>

          {category && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `color-mix(in srgb, ${category.color} 20%, transparent)`,
                color: category.color,
              }}
            >
              {category.name}
            </span>
          )}

          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-medium",
                expired
                  ? "text-[var(--color-danger)]"
                  : today
                    ? "text-[var(--color-warning)]"
                    : "text-[var(--color-text-muted)]"
              )}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.description && (
          <p
            className={cn(
              "text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2",
              task.completed && "line-through"
            )}
          >
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}