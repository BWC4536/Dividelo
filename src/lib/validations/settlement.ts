import { z } from "zod";

export const createSettlementSchema = z.object({
  payerId: z.string().cuid("ID de pagador inválido"),
  receiverId: z.string().cuid("ID de receptor inválido"),
  amount: z.number().positive("El monto debe ser mayor que 0"),
  currency: z.string().length(3).default("EUR"),
  note: z.string().max(500).optional(),
  date: z.string().datetime().optional(),
}).refine((data) => data.payerId !== data.receiverId, {
  message: "El pagador y el receptor no pueden ser la misma persona",
  path: ["receiverId"],
});

export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;
