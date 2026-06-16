"use client";

import { cn } from "@/lib/utils";
import { formatDate, isExpired, isToday } from "@/lib/utils";
import { PRIORITY_LABELS } from "@/features/todo/types";
import type { Task, Category } from "@/features/todo/types";
import { Checkbox } from "@/components/ui/Checkbox";

interface DayTasksPopupProps {
  date: Date;
  tasks: Task[];
  categories: Category[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function DayTasksPopup({
  date,
  tasks,
  categories,
  onToggle,
  onClose,
}: DayTasksPopupProps) {
  const todayFlag = isToday(date);
  const dateStr = formatDate(date);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[var(--shadow-modal)] animate-in fade-in zoom-in-95 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            {todayFlag && (
              <span className="text-[11px] text-[var(--color-accent)] font-medium">Hoje</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 max-h-72 overflow-y-auto space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-6">
              Nenhuma tarefa para esta data
            </p>
          ) : (
            tasks.map((task) => {
              const cat = categories.find((c) => c.id === task.categoryId);
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-[var(--radius-lg)] transition-all",
                    task.completed ? "opacity-50" : "hover:bg-[var(--color-surface-hover)]"
                  )}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="pt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium text-[var(--color-text-primary)]",
                        task.completed && "line-through text-[var(--color-text-muted)]"
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider",
                          task.priority === "HIGH" && "text-[var(--color-danger)]",
                          task.priority === "MEDIUM" && "text-[var(--color-warning)]",
                          task.priority === "LOW" && "text-[var(--color-info)]"
                        )}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {cat && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {cat.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}