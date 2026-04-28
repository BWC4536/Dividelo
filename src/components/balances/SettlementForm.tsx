"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { GroupMember, CreateSettlementInput } from "@/types";
import { createSettlement } from "@/hooks/useBalances";

const settlementSchema = z.object({
  payerId: z.string().min(1),
  receiverId: z.string().min(1),
  amount: z.number().min(0.01, "Monto debe ser mayor a 0"),
  note: z.string().optional(),
  date: z.string(),
});

type SettlementFormData = z.infer<typeof settlementSchema>;

interface SettlementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: GroupMember[];
  currency?: string;
  defaultPayerId?: string;
  defaultReceiverId?: string;
  defaultAmount?: number;
}

export function SettlementForm({
  open,
  onOpenChange,
  groupId,
  members,
  currency = "EUR",
  defaultPayerId,
  defaultReceiverId,
  defaultAmount,
}: SettlementFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm<SettlementFormData>({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      payerId: defaultPayerId ?? "",
      receiverId: defaultReceiverId ?? "",
      amount: defaultAmount ?? 0,
      note: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: SettlementFormData) => {
    if (data.payerId === data.receiverId) {
      toast.error("El pagador y receptor no pueden ser el mismo");
      return;
    }
    setLoading(true);
    try {
      await createSettlement(groupId, data as CreateSettlementInput);
      toast.success("Pago registrado");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al registrar pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Pagador</Label>
            <Controller
              name="payerId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Quién paga?" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.user?.name ?? m.userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Receptor</Label>
            <Controller
              name="receiverId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿A quién le paga?" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.user?.name ?? m.userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Monto</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  currency={currency}
                />
              )}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input type="date" {...register("date")} />
          </div>

          <div className="space-y-2">
            <Label>Nota (opcional)</Label>
            <Input placeholder="Ej: Transferencia Bizum" {...register("note")} />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Registrar pago
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
