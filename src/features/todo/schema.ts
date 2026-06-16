import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200, "Título muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  completed: z.boolean().default(false),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  categoryId: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  color: z.string().min(1, "Cor é obrigatória"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;