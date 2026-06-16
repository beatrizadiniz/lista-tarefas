"use client";

import { cn } from "@/lib/utils";

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  className?: string;
}

export function DonutChart({ segments, size = 160, className }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.12;
  const circ = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-bg-secondary)" strokeWidth={strokeW} />
        {segments.map((seg) => {
          const pct = seg.value / total;
          const len = pct * circ;
          const dash = `${len} ${circ - len}`;
          const dashOffset = -offset;
          offset += len;
          return (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeDasharray={dash}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-700"
              style={{ strokeLinecap: "round" as const }}
            />
          );
        })}
      </svg>
    </div>
  );
}