import { z } from "zod";

export const emailSchema = z.string().email("Please enter a valid email.").trim();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").trim(),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const workspaceCreateSchema = z.object({
  name: z.string().min(1, "Workspace name is required.").max(100).trim(),
});

export const workspaceUpdateSchema = workspaceCreateSchema;

export const messageCreateSchema = z.object({
  content: z.string().min(1, "Question cannot be empty.").max(4000).trim(),
});

export const conversationCreateSchema = z.object({
  title: z.string().max(200).trim().optional(),
});

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WorkspaceCreateInput = z.infer<typeof workspaceCreateSchema>;
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
