"use client";

import { useMemo } from "react";
import { useTodos } from "@/features/todo/hooks/useTodos";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { PRIORITY_LABELS } from "@/features/todo/types";
import type { Priority } from "@/features/todo/types";

export default function AnalyticsPage() {
  const { tasks, categories } = useTodos();

  const priorityData = useMemo(() => {
    const counts: Record<Priority, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    tasks.forEach((t) => {
      if (!t.completed) counts[t.priority]++;
    });
    return [
      { label: PRIORITY_LABELS.HIGH, value: counts.HIGH, color: "var(--color-danger)" },
      { label: PRIORITY_LABELS.MEDIUM, value: counts.MEDIUM, color: "var(--color-warning)" },
      { label: PRIORITY_LABELS.LOW, value: counts.LOW, color: "var(--color-info)" },
    ];
  }, [tasks]);

  const categoryData = useMemo(() => {
    const map = new Map<string, { label: string; value: number; color: string }>();
    categories.forEach((c) => {
      map.set(c.id, { label: c.name, value: 0, color: c.color });
    });
    const otherTasks = tasks.filter((t) => !t.categoryId);
    tasks.forEach((t) => {
      if (t.categoryId) {
        const existing = map.get(t.categoryId);
        if (existing) existing.value++;
      }
    });
    const result = Array.from(map.values()).filter((c) => c.value > 0);
    if (otherTasks.length > 0) {
      result.push({
        label: "Sem categoria",
        value: otherTasks.length,
        color: "var(--color-text-muted)",
      });
    }
    return result;
  }, [tasks, categories]);

  const completionData = useMemo(() => {
    const total = tasks.length || 1;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return [
      { label: "Concluídas", value: completed, color: "var(--color-success)" },
      { label: "Pendentes", value: pending, color: "var(--color-warning)" },
    ];
  }, [tasks]);

  const dueDateData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const monthEnd = new Date(today);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    let overdue = 0;
    let thisWeek = 0;
    let thisMonth = 0;
    let later = 0;

    tasks.forEach((t) => {
      if (t.completed || !t.dueDate) return;
      const d = new Date(t.dueDate);
      if (d < today) overdue++;
      else if (d <= weekEnd) thisWeek++;
      else if (d <= monthEnd) thisMonth++;
      else later++;
    });

    return [
      { label: "Atrasadas", value: overdue, color: "var(--color-danger)" },
      { label: "Esta semana", value: thisWeek, color: "var(--color-warning)" },
      { label: "Este mês", value: thisMonth, color: "var(--color-accent)" },
      { label: "Futuras", value: later, color: "var(--color-info)" },
    ];
  }, [tasks]);

  const weeklyTrend = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = dayNames[d.getDay()];
      const completed = tasks.filter((t) => {
        if (!t.completed) return false;
        const updated = new Date(t.updatedAt);
        return (
          updated.getDate() === d.getDate() &&
          updated.getMonth() === d.getMonth() &&
          updated.getFullYear() === d.getFullYear()
        );
      }).length;
      days.push({ label, value: completed });
    }
    return days;
  }, [tasks]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
            Análises
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Estatísticas e insights sobre suas tarefas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Progresso Geral
            </h2>
            <div className="flex items-center gap-6">
              <DonutChart segments={completionData} size={140} />
              <div className="space-y-2">
                {completionData.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-[var(--color-text-secondary)]">{seg.label}</span>
                    <span className="font-medium text-[var(--color-text-primary)] ml-auto">
                      {seg.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Prioridades Pendentes
            </h2>
            <BarChart items={priorityData} />
          </div>

          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Tarefas por Data
            </h2>
            <BarChart items={dueDateData} />
          </div>

          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Concluídas por Dia (últimos 7 dias)
            </h2>
            <div className="flex items-end justify-between gap-2 h-32 pt-2">
              {weeklyTrend.map((day) => {
                const max = Math.max(...weeklyTrend.map((d) => d.value), 1);
                const pct = (day.value / max) * 100;
                return (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums">
                      {day.value}
                    </span>
                    <div
                      className="w-full rounded-[var(--radius-sm)] transition-all duration-500"
                      style={{
                        height: `${Math.max(pct, 2)}%`,
                        backgroundColor: day.value > 0
                          ? "var(--color-accent)"
                          : "var(--color-bg-secondary)",
                      }}
                    />
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Categorias
            </h2>
            {categoryData.length > 0 ? (
              <BarChart items={categoryData} />
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                Nenhuma categoria com tarefas ainda
              </p>
            )}
          </div>
        </div>
    </main>
  );
}