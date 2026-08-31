import { z } from "zod";

export const createContactSchema = z.strictObject({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320).transform((email) => email.toLowerCase()),
  company: z.string().trim().min(1).max(200),
});

export const contactIdSchema = z.string().uuid();

export type CreateContactInput = z.infer<typeof createContactSchema>;
