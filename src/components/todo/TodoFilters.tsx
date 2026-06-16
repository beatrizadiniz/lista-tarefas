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
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]"
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
          className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)] transition-colors"
        />
      </div>

      <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 h-9 px-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150",
              current === key
                ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {label}
            <span
              className={cn(
                "text-[11px] px-1.5 py-0.5 rounded-full",
                current === key
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-border)] text-[var(--color-text-muted)]"
              )}
            >
              {stats[count]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}