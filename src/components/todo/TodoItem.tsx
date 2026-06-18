"use client";

import { cn, formatDate, isExpired, isToday } from "@/lib/utils";
import { PRIORITY_LABELS } from "@/features/todo/types";
import type { Task, Category, Priority } from "@/features/todo/types";
import { Checkbox } from "@/components/ui/Checkbox";

interface TodoItemProps {
  task: Task;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityConfig: Record<
  Priority,
  {
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    label: string;
  }
> = {
  HIGH: {
    borderColor: "var(--color-danger)",
    badgeBg: "var(--color-danger-light)",
    badgeText: "var(--color-danger)",
    label: "Alta",
  },
  MEDIUM: {
    borderColor: "var(--color-warning)",
    badgeBg: "var(--color-warning-light)",
    badgeText: "var(--color-warning)",
    label: "Média",
  },
  LOW: {
    borderColor: "var(--color-info)",
    badgeBg: "var(--color-info-light)",
    badgeText: "var(--color-info)",
    label: "Baixa",
  },
};

export function TodoItem({ task, category, onToggle, onDelete }: TodoItemProps) {
  const priority = priorityConfig[task.priority];
  const expired = task.dueDate && isExpired(task.dueDate) && !task.completed;
  const today = task.dueDate && isToday(task.dueDate) && !task.completed;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-[var(--radius-lg)]",
        "bg-[var(--color-surface)] border border-[var(--color-border)]",
        "transition-all duration-200",
        "hover:-translate-y-[1px] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-border-focus)]",
        task.completed && "opacity-55"
      )}
      style={{
        borderLeft: `3px solid ${priority.borderColor}`,
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="pt-0.5 shrink-0"
      />

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "text-sm font-semibold text-[var(--color-text-primary)] leading-snug",
              task.completed && "line-through text-[var(--color-text-muted)]"
            )}
          >
            {task.title}
          </h3>

          <button
            onClick={() => onDelete(task.id)}
            className={cn(
              "shrink-0 p-1.5 rounded-[var(--radius-sm)]",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
              "text-[var(--color-text-muted)] hover:text-[var(--color-danger)]",
              "hover:bg-[var(--color-danger-light)]",
              "transition-all duration-150"
            )}
            aria-label={`Excluir tarefa ${task.title}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority badge */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: priority.badgeBg,
              color: priority.badgeText,
            }}
          >
            {priority.label}
          </span>

          {/* Category badge */}
          {category && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `color-mix(in srgb, ${category.color} 18%, transparent)`,
                color: category.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </span>
          )}

          {/* Due date */}
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
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              {expired && "Vencido · "}
              {today && "Hoje · "}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}