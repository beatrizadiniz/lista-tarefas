"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = "default", className, style }: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]",
    success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
    warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
    danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
    info: "bg-[var(--color-info-light)] text-[var(--color-info)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-semibold uppercase tracking-wider",
        variants[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}