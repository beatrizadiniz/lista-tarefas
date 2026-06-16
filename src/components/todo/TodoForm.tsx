"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PRIORITY_LABELS } from "@/features/todo/types";
import type { Priority, Category } from "@/features/todo/types";

interface TodoFormProps {
  categories: Category[];
  onSubmit: (data: {
    title: string;
    priority: Priority;
    dueDate?: string;
    categoryId?: string;
    description?: string;
  }) => void;
}

export function TodoForm({ categories, onSubmit }: TodoFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
      categoryId: categoryId || undefined,
      description: description.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setCategoryId("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full" size="lg">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Nova Tarefa
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Nova Tarefa
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <Input
        placeholder="O que você precisa fazer?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <Input
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Prioridade"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--color-text-primary)]">
            Data
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full h-10 px-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <Select
          label="Categoria"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="Selecione uma categoria"
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={!title.trim()}>
          Adicionar
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}