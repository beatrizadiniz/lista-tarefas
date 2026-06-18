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
          "relative flex items-center justify-center w-[22px] h-[22px] rounded-[6px] border-2 transition-all duration-200",
          checked
            ? "border-transparent shadow-[var(--glow-accent-sm)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] group-hover:border-[var(--color-accent)]"
        )}
        style={checked ? { background: "var(--gradient-accent)" } : {}}
      >
        {checked && (
          <svg
            className="h-[11px] w-[11px] text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: "checkPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
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
        <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
      )}
      <style jsx>{`
        @keyframes checkPop {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </label>
  );
}