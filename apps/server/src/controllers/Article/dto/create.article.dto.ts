import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters long")
    .max(1000, "The content must be a maximum of 1000 characters."),
  cover_image: z.url("Invalid cover image URL").optional().nullable(),
  published: z.boolean().default(false),
  category_id: z.string().min(1, "Category ID is required"),
});

export type CreateArticleDto = z.infer<typeof createArticleSchema>;
