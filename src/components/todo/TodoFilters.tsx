"use client";

import { cn } from "@/lib/utils";
import type { FilterType } from "@/features/todo/types";

interface TodoFiltersProps {
  current: FilterType;
  stats: { total: number; pending: number; completed: number };
  onChange: (filter: FilterType) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const filters: { key: FilterType; label: string; count: keyof TodoFiltersProps["stats"] }[] = [
  { key: "ALL", label: "Todas", count: "total" },
  { key: "PENDING", label: "Pendentes", count: "pending" },
  { key: "COMPLETED", label: "Concluídas", count: "completed" },
];

export function TodoFilters({
  current,
  stats,
  onChange,
  search,
  onSearchChange,
}: TodoFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full h-11 pl-10 pr-4",
            "rounded-[var(--radius-lg)] border border-[var(--color-border)]",
            "bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",
            "transition-all duration-200",
            "focus:outline-none focus:border-[var(--color-border-focus)]",
            "focus:shadow-[var(--glow-accent-sm)]",
            "focus:ring-0"
          )}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-9 px-3",
              "rounded-[var(--radius-md)] text-sm font-medium",
              "transition-all duration-200",
              current === key
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]/50"
            )}
          >
            {label}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center transition-all duration-200",
                current === key
                  ? "text-white"
                  : "bg-[var(--color-border)] text-[var(--color-text-muted)]"
              )}
              style={
                current === key
                  ? { background: "var(--gradient-accent)" }
                  : {}
              }
            >
              {stats[count]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}