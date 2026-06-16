"use client";

import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  label?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled,
  className,
  id,
  label,
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer group",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span
        className={cn(
          "relative flex items-center justify-center w-5 h-5 rounded-[var(--radius-sm)] border-2 transition-all duration-150",
          checked
            ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] group-hover:border-[var(--color-accent)]"
        )}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        aria-checked={checked}
      />
      {label && (
        <span className="text-sm text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
    </label>
  );
}