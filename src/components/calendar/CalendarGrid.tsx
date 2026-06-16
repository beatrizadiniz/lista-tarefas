"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Task, Category } from "@/features/todo/types";

interface CalendarGridProps {
  tasks: Task[];
  categories: Category[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getMonthDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days: Date[] = [];

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1);
    days.push(d);
  }

  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export function CalendarGrid({
  tasks,
  categories,
  currentMonth,
  onMonthChange,
  onDayClick,
}: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const today = new Date();

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const existing = map.get(key) || [];
      existing.push(t);
      map.set(key, existing);
    });
    return map;
  }, [tasks]);

  const prevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <button
          onClick={prevMonth}
          className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all"
          aria-label="Mês anterior"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all"
          aria-label="Próximo mês"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
          >
            {name}
          </div>
        ))}

        {days.map((day, i) => {
          const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const dayTasks = tasksByDay.get(key) || [];
          const isCurrentMonth = day.getMonth() === month;
          const isTodayFlag = isSameDate(day, today);

          return (
            <button
              key={i}
              onClick={() => onDayClick(day)}
              className={cn(
                "relative min-h-[72px] p-1.5 border-t border-r border-[var(--color-border)] text-left transition-colors",
                "hover:bg-[var(--color-surface-hover)]",
                !isCurrentMonth && "opacity-30",
                isTodayFlag && "bg-[var(--color-accent-light)]"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-6 h-6 text-xs rounded-full",
                  isTodayFlag
                    ? "bg-[var(--color-accent)] text-white font-bold"
                    : "text-[var(--color-text-primary)]"
                )}
              >
                {day.getDate()}
              </span>

              {dayTasks.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {dayTasks.slice(0, 3).map((t) => {
                    const cat = categories.find((c) => c.id === t.categoryId);
                    return (
                      <div
                        key={t.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: cat?.color || "var(--color-text-muted)",
                          opacity: t.completed ? 0.4 : 1,
                        }}
                        title={t.title}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-[var(--color-text-muted)] ml-0.5">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}