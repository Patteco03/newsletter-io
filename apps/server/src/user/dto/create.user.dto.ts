import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["READER", "ADMIN", "EDITOR", "AUTHOR"]).default("READER"),
  avatar: z.url("Avatar must be a valid URL").optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
