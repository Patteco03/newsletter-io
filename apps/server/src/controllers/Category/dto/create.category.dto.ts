import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().max(255).optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
