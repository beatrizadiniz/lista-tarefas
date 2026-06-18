"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { useTodos } from "@/features/todo/hooks/useTodos";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoList } from "@/components/todo/TodoList";
import { TodoFilters } from "@/components/todo/TodoFilters";
import { TodoStats } from "@/components/todo/TodoStats";
import { CategoryManager } from "@/components/todo/CategoryManager";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`shimmer rounded-[var(--radius-lg)] ${className}`} />;
}

export default function TodoPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/login");
    });
  }, [router]);

  const {
    categories,
    filter,
    search,
    stats,
    filteredTasks,
    setFilter,
    setSearch,
    addTask,
    toggleTask,
    deleteTask,
    addCategory,
    deleteCategory,
    isLoading,
  } = useTodos();

  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="space-y-2">
          <SkeletonBlock className="h-9 w-52" />
          <SkeletonBlock className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <SkeletonBlock key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <SkeletonBlock className="h-14" />
            <SkeletonBlock className="h-24" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-20" />)}
            </div>
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-44" />
            <SkeletonBlock className="h-28" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold mb-1">
          <span className="gradient-text">Minhas Tarefas</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Gerencie suas tarefas de forma simples e eficiente
        </p>
      </div>

      {/* Stats */}
      <TodoStats stats={stats} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task column */}
        <div className="lg:col-span-3 space-y-4">
          <TodoForm categories={categories} onSubmit={addTask} />

          <TodoFilters
            current={filter}
            stats={stats}
            onChange={setFilter}
            search={search}
            onSearchChange={setSearch}
          />

          <TodoList
            tasks={filteredTasks}
            categories={categories}
            filter={filter}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={() => {}}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Categories */}
          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-card)]">
            <CategoryManager
              categories={categories}
              onAdd={addCategory}
              onDelete={deleteCategory}
            />
          </div>

          {/* Progress */}
          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
              Progresso Geral
            </h3>

            {/* Circular progress */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke="var(--color-bg-secondary)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionPct / 100)}`}
                    style={{
                      stroke: "url(#progress-gradient)",
                      transition: "stroke-dashoffset 0.5s ease",
                    }}
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.52 0.28 265)" />
                      <stop offset="100%" stopColor="oklch(0.52 0.22 300)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-[var(--color-text-primary)]">
                    {completionPct}%
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    {stats.completed} concluída{stats.completed !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    {stats.pending} pendente{stats.pending !== 1 ? "s" : ""}
                  </span>
                </div>
                {stats.highPriority > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />
                    <span className="text-[var(--color-text-secondary)]">
                      {stats.highPriority} alta prioridade
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${completionPct}%`,
                  background: "var(--gradient-accent)",
                  boxShadow: completionPct > 0 ? "var(--glow-accent-sm)" : "none",
                }}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}