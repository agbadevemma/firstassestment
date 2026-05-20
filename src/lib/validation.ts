
import { z } from "zod";

export const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  price: z.coerce.number().min(0.01, "Price must be greater than 0").max(1000000),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int("Must be an integer").min(0).max(100000),
  description: z.string().trim().min(5, "Description too short").max(1000),
});

export type FormValues = z.infer<typeof schema>;