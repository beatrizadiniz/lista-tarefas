"use client";

import { cn } from "@/lib/utils";

interface BarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  showValue?: boolean;
}

export function BarChartBar({ label, value, max, color, showValue = true }: BarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-primary)] font-medium">{label}</span>
        {showValue && (
          <span className="text-[var(--color-text-muted)] tabular-nums">{value}</span>
        )}
      </div>
      <div className="h-2 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface BarChartProps {
  items: { label: string; value: number; color: string }[];
  className?: string;
}

export function BarChart({ items, className }: BarChartProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <BarChartBar
          key={item.label}
          label={item.label}
          value={item.value}
          max={max}
          color={item.color}
        />
      ))}
    </div>
  );
}