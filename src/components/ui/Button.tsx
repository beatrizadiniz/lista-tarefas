"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary:
        "text-white font-semibold " +
        "bg-[image:var(--gradient-accent)] " +
        "hover:opacity-90 hover:shadow-[var(--glow-accent-sm)] " +
        "active:scale-[0.97] active:opacity-100",
      secondary:
        "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] " +
        "hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] " +
        "hover:border-[var(--color-border-focus)]",
      ghost:
        "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] " +
        "hover:text-[var(--color-text-primary)]",
      danger:
        "bg-[var(--color-danger-light)] text-[var(--color-danger)] " +
        "hover:opacity-80 hover:shadow-[var(--glow-danger)]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-md)]",
      md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
      lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-lg)]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";