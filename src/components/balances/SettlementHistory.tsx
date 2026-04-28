"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Undo2 } from "lucide-react";
import { Settlement } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils/cn";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { deleteSettlement } from "@/hooks/useBalances";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface SettlementHistoryProps {
  settlements: Settlement[];
  groupId: string;
  currency?: string;
  isLoading?: boolean;
}

export function SettlementHistory({
  settlements,
  groupId,
  currency = "EUR",
  isLoading,
}: SettlementHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      await deleteSettlement(groupId, deletingId);
      toast.success("Pago anulado");
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || "Error al anular pago");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No hay pagos registrados
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {settlements.map((settlement, i) => (
          <motion.div
            key={settlement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <UserAvatar
              name={settlement.payer?.name}
              image={settlement.payer?.image}
              size="xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold truncate">
                  {settlement.payer?.name}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-xs font-semibold truncate">
                  {settlement.receiver?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-emerald-600">
                  {formatCurrency(settlement.amount, currency)}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {formatDate(settlement.date)}
                </span>
              </div>
              {settlement.note && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">
                  "{settlement.note}"
                </p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => setDeletingId(settlement.id)}
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Anular pago"
        description="¿Estás seguro de que quieres anular este pago? Los balances se actualizarán."
        confirmLabel="Anular pago"
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
