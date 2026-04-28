import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  description: z.string().max(500).optional(),
  currency: z.string().length(3).default("EUR"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  currency: z.string().length(3).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  archived: z.boolean().optional(),
});

export const addMemberSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const inviteTokenSchema = z.object({
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type InviteTokenInput = z.infer<typeof inviteTokenSchema>;
