"use client";

import { useState, useMemo } from "react";
import { useTodos } from "@/features/todo/hooks/useTodos";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayTasksPopup } from "@/components/calendar/DayTasksPopup";

export default function CalendarPage() {
  const { tasks, categories, toggleTask } = useTodos();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return [];
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getDate() === selectedDay.getDate() &&
        d.getMonth() === selectedDay.getMonth() &&
        d.getFullYear() === selectedDay.getFullYear()
      );
    });
  }, [tasks, selectedDay]);

  const tasksWithDueDate = useMemo(
    () => tasks.filter((t) => t.dueDate),
    [tasks]
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
            Calendário
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Visualize suas tarefas por data
          </p>
        </div>

        <CalendarGrid
          tasks={tasksWithDueDate}
          categories={categories}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={setSelectedDay}
        />

        {selectedDay && (
          <DayTasksPopup
            date={selectedDay}
            tasks={selectedDayTasks}
            categories={categories}
            onToggle={toggleTask}
            onClose={() => setSelectedDay(null)}
          />
        )}
    </main>
  );
}