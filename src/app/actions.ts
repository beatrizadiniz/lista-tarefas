"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { taskSchema } from "@/features/todo/schema";
import type { Priority } from "@/features/todo/types";

export async function createTask(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    priority: (formData.get("priority") as Priority) || "MEDIUM",
    dueDate: (formData.get("dueDate") as string) || undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
  };

  const validated = taskSchema.parse(data);

  await prisma.task.create({
    data: {
      title: validated.title,
      description: validated.description,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      categoryId: validated.categoryId || null,
    },
  });

  revalidatePath("/");
}

export async function toggleTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return;

  await prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });

  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/");
}

export async function updateTask(id: string, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    priority: (formData.get("priority") as Priority) || "MEDIUM",
    dueDate: (formData.get("dueDate") as string) || undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
    completed: formData.get("completed") === "true",
  };

  const validated = taskSchema.parse(data);

  await prisma.task.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      categoryId: validated.categoryId || null,
      completed: validated.completed,
    },
  });

  revalidatePath("/");
}