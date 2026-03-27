import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a number'),
});

export const createTodoSchema = z.object({
  title: z.string().min(1, 'title is required').max(255),
  content: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export type IdParamsType = z.infer<typeof idParamsSchema>;
export type CreateTodoType = z.infer<typeof createTodoSchema>;
export type UpdateTodoType = z.infer<typeof updateTodoSchema>;