"use client";

import type { TodoStats } from "@/features/todo/types";

interface TodoStatsProps {
  stats: TodoStats;
}

export function TodoStats({ stats }: TodoStatsProps) {
  const items = [
    {
      label: "Total",
      value: stats.total,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      color: "var(--color-accent)",
    },
    {
      label: "Pendentes",
      value: stats.pending,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "var(--color-warning)",
    },
    {
      label: "Concluídas",
      value: stats.completed,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: "var(--color-success)",
    },
    {
      label: "Alta Prioridade",
      value: stats.highPriority,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      ),
      color: "var(--color-danger)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="p-1.5 rounded-[var(--radius-sm)]"
              style={{
                backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                color: item.color,
              }}
            >
              {item.icon}
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mb-0.5">
            {item.value}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}