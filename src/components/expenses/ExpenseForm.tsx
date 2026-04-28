"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { CategoryPicker } from "./CategoryPicker";
import { ReceiptUpload } from "./ReceiptUpload";
import { SplitEditor } from "./SplitEditor";
import { Expense, GroupMember, ExpenseCategory } from "@/types";
import { createExpense, updateExpense } from "@/hooks/useExpenses";

const expenseSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100),
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  category: z.string(),
  description: z.string().optional(),
  date: z.string(),
  paidById: z.string().min(1, "Selecciona quién pagó"),
  receiptUrl: z.string().nullable().optional(),
  splits: z.array(z.object({ userId: z.string(), amount: z.number() })),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: GroupMember[];
  currency?: string;
  expense?: Expense;
  currentUserId?: string;
}

export function ExpenseForm({
  open,
  onOpenChange,
  groupId,
  members,
  currency = "EUR",
  expense,
  currentUserId,
}: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: expense?.title ?? "",
      amount: expense?.amount ?? 0,
      category: expense?.category ?? "other",
      description: expense?.description ?? "",
      date: expense?.date
        ? format(new Date(expense.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      paidById: expense?.paidById ?? currentUserId ?? "",
      receiptUrl: expense?.receiptUrl ?? null,
      splits:
        expense?.splits?.map((s) => ({
          userId: s.userId,
          amount: s.amount,
        })) ??
        members.map((m) => ({
          userId: m.userId,
          amount: 0,
        })),
    },
  });

  const amountValue = watch("amount");

  const onSubmit = async (data: ExpenseFormData) => {
    if (data.splits.length === 0) {
      toast.error("Debes seleccionar al menos un participante");
      return;
    }
    const totalSplit = data.splits.reduce((a, b) => a + b.amount, 0);
    if (Math.abs(totalSplit - data.amount) > 0.05) {
      toast.error(
        `La suma de partes (${totalSplit.toFixed(2)}) no coincide con el total (${data.amount.toFixed(2)})`
      );
      return;
    }

    setLoading(true);
    try {
      if (isEditing && expense) {
        await updateExpense(groupId, expense.id, {
          ...data,
          category: data.category as ExpenseCategory,
        });
        toast.success("Gasto actualizado");
      } else {
        await createExpense(groupId, {
          ...data,
          category: data.category as ExpenseCategory,
        });
        toast.success("Gasto añadido");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar gasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[95vh] md:h-full md:inset-y-0 md:right-0 md:left-auto md:w-[480px] md:max-h-screen rounded-t-2xl md:rounded-none overflow-hidden p-0"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle>
              {isEditing ? "Editar gasto" : "Nuevo gasto"}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-5 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Cena restaurante"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>Monto *</Label>
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
                  <p className="text-xs text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <CategoryPicker
                      value={field.value as ExpenseCategory}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <Separator />

              {/* Paid by */}
              <div className="space-y-2">
                <Label>¿Quién pagó?</Label>
                <Controller
                  name="paidById"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar pagador" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((m) => (
                          <SelectItem key={m.userId} value={m.userId}>
                            {m.user?.name ?? m.userId}
                            {m.userId === currentUserId ? " (tú)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="date" {...register("date")} />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Descripción (opcional)</Label>
                <Input
                  placeholder="Notas adicionales"
                  {...register("description")}
                />
              </div>

              <Separator />

              {/* Split editor */}
              <div className="space-y-2">
                <Label>Dividir entre</Label>
                <Controller
                  name="splits"
                  control={control}
                  render={({ field }) => (
                    <SplitEditor
                      members={members}
                      totalAmount={amountValue || 0}
                      currency={currency}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <Separator />

              {/* Receipt upload */}
              <div className="space-y-2">
                <Label>Foto del recibo (opcional)</Label>
                <Controller
                  name="receiptUrl"
                  control={control}
                  render={({ field }) => (
                    <ReceiptUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="h-4" />
            </div>
          </ScrollArea>

          <div className="border-t border-border px-6 py-4">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {isEditing ? "Guardar cambios" : "Añadir gasto"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
