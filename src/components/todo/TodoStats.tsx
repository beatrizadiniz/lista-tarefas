"use client";

import type { TodoStats } from "@/features/todo/types";

interface TodoStatsProps {
  stats: TodoStats;
}

const items = (stats: TodoStats) => [
  {
    label: "Total",
    value: stats.total,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    accent: "oklch(0.52 0.28 265)",
    gradient: "linear-gradient(135deg, oklch(0.52 0.28 265 / 0.12), oklch(0.52 0.22 300 / 0.06))",
    glow: "0 0 20px oklch(0.52 0.28 265 / 0.12)",
    topColor: "oklch(0.52 0.28 265)",
  },
  {
    label: "Pendentes",
    value: stats.pending,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    accent: "oklch(0.68 0.22 75)",
    gradient: "linear-gradient(135deg, oklch(0.68 0.22 75 / 0.12), oklch(0.68 0.2 50 / 0.06))",
    glow: "0 0 20px oklch(0.68 0.22 75 / 0.12)",
    topColor: "oklch(0.68 0.22 75)",
  },
  {
    label: "Concluídas",
    value: stats.completed,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    accent: "oklch(0.58 0.22 150)",
    gradient: "linear-gradient(135deg, oklch(0.58 0.22 150 / 0.12), oklch(0.58 0.2 170 / 0.06))",
    glow: "0 0 20px oklch(0.58 0.22 150 / 0.12)",
    topColor: "oklch(0.58 0.22 150)",
  },
  {
    label: "Alta Prioridade",
    value: stats.highPriority,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </svg>
    ),
    accent: "oklch(0.58 0.22 25)",
    gradient: "linear-gradient(135deg, oklch(0.58 0.22 25 / 0.12), oklch(0.58 0.2 10 / 0.06))",
    glow: "0 0 20px oklch(0.58 0.22 25 / 0.12)",
    topColor: "oklch(0.58 0.22 25)",
  },
];

export function TodoStats({ stats }: TodoStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items(stats).map((item) => (
        <div
          key={item.label}
          className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 transition-all duration-200 hover:-translate-y-[1px]"
          style={{
            background: `var(--color-surface)`,
            boxShadow: `var(--shadow-card)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `var(--shadow-card-hover), ${item.glow}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = `var(--shadow-card)`;
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[var(--radius-lg)]"
            style={{ backgroundColor: item.topColor }}
          />

          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: item.gradient }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="p-2 rounded-[var(--radius-md)]"
                style={{
                  backgroundColor: `color-mix(in srgb, ${item.accent} 14%, transparent)`,
                  color: item.accent,
                }}
              >
                {item.icon}
              </span>
            </div>
            <p
              className="text-3xl font-extrabold mb-0.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.value}
            </p>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}