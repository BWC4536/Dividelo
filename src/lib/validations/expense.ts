import { z } from "zod";

const splitSchema = z.object({
  userId: z.string().cuid(),
  amount: z.number().positive("El monto debe ser positivo"),
});

export const createExpenseSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200),
  amount: z.number().positive("El monto debe ser mayor que 0"),
  currency: z.string().length(3).default("EUR"),
  category: z.string().default("other"),
  description: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
  paidById: z.string().cuid("ID de pagador inválido"),
  splits: z
    .array(splitSchema)
    .min(1, "Debe haber al menos un participante en el split"),
}).refine(
  (data) => {
    const totalSplits = data.splits.reduce((sum, s) => sum + s.amount, 0);
    return Math.abs(totalSplits - data.amount) < 0.01;
  },
  {
    message: "La suma de los splits debe ser igual al monto total",
    path: ["splits"],
  }
);

export const updateExpenseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  category: z.string().optional(),
  description: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
  paidById: z.string().cuid().optional(),
  splits: z.array(splitSchema).min(1).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "El comentario no puede estar vacío").max(500),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type SplitInput = z.infer<typeof splitSchema>;
