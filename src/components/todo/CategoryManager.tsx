"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Category } from "@/features/todo/types";

const PRESET_COLORS = [
  { name: "Indigo", value: "oklch(0.52 0.22 265)" },
  { name: "Rosa", value: "oklch(0.58 0.22 330)" },
  { name: "Verde", value: "oklch(0.58 0.22 150)" },
  { name: "Âmbar", value: "oklch(0.68 0.22 75)" },
  { name: "Ciano", value: "oklch(0.62 0.18 195)" },
  { name: "Vermelho", value: "oklch(0.58 0.22 25)" },
  { name: "Azul", value: "oklch(0.55 0.22 240)" },
  { name: "Roxo", value: "oklch(0.55 0.22 295)" },
];

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string, color: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryManager({ categories, onAdd, onDelete }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
    setColor(PRESET_COLORS[0].value);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          Categorias
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Nova
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] text-center py-3">
          Nenhuma categoria ainda
        </p>
      ) : (
        <div className="space-y-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] group transition-all duration-150 cursor-default"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{
                    backgroundColor: cat.color,
                    boxShadow: `0 0 8px ${cat.color}60`,
                  }}
                />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {cat.name}
                </span>
              </div>
              <button
                onClick={() => onDelete(cat.id)}
                className="p-1 rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-all"
                aria-label={`Excluir categoria ${cat.name}`}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nova Categoria">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Cor
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  className="relative w-9 h-9 rounded-full transition-all duration-150 hover:scale-110"
                  style={{
                    backgroundColor: preset.value,
                    boxShadow: color === preset.value
                      ? `0 0 0 3px var(--color-surface), 0 0 0 5px ${preset.value}, 0 0 12px ${preset.value}80`
                      : `0 0 6px ${preset.value}40`,
                    transform: color === preset.value ? "scale(1.15)" : undefined,
                  }}
                  aria-label={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={!name.trim()}>
              Criar categoria
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}