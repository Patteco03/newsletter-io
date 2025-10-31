import { z } from "zod";

export interface PaginationDto<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type PaginationType = z.infer<typeof paginationSchema>