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

export default function TodoPage() {
  const router = useRouter();
  
  // Redirect unauthenticated users to login page
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      }
    });
  }, [router]);
  const {
    tasks,
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
    updateTask,
    addCategory,
    deleteCategory,
    isLoading,
  } = useTodos();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-[var(--color-surface-hover)] rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-[var(--color-surface-hover)] rounded-md"></div>
        </div>

        {/* Estatísticas Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Formulário Skeleton */}
            <div className="h-14 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"></div>
            {/* Filtros Skeleton */}
            <div className="h-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"></div>
            {/* Lista de tarefas Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"></div>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="h-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"></div>
            <div className="h-28 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"></div>
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
            Minhas Tarefas
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Gerencie suas tarefas de forma simples e eficiente
          </p>
        </div>

        <TodoStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

          <aside className="space-y-4">
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
              <CategoryManager
                categories={categories}
                onAdd={addCategory}
                onDelete={deleteCategory}
              />
            </div>

            <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Progresso
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">Concluído</span>
                  <span className="text-[var(--color-text-muted)]">
                    {stats.total > 0
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-success)] transition-all duration-500"
                    style={{
                      width: `${
                        stats.total > 0
                          ? (stats.completed / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
    </main>
  );
}