"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Debt, GroupMember } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/cn";
import { SettlementForm } from "./SettlementForm";

interface DebtSimplifierProps {
  debts: Debt[];
  groupId: string;
  members: GroupMember[];
  currency?: string;
}

export function DebtSimplifier({
  debts,
  groupId,
  members,
  currency = "EUR",
}: DebtSimplifierProps) {
  const [settlementData, setSettlementData] = useState<{
    payerId: string;
    receiverId: string;
    amount: number;
  } | null>(null);

  if (debts.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20 p-6 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          ¡Todo saldado!
        </p>
        <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
          No hay deudas pendientes en este grupo
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {debts.map((debt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
          >
            <UserAvatar
              name={debt.from?.name}
              image={debt.from?.image}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold truncate">
                  {debt.from?.name ?? "Usuario"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-semibold truncate">
                  {debt.to?.name ?? "Usuario"}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground mt-0.5">
                {formatCurrency(debt.amount, currency)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <UserAvatar
                name={debt.to?.name}
                image={debt.to?.image}
                size="sm"
              />
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() =>
                  setSettlementData({
                    payerId: debt.from.id,
                    receiverId: debt.to.id,
                    amount: debt.amount,
                  })
                }
              >
                Marcar pagado
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {settlementData && (
        <SettlementForm
          open={!!settlementData}
          onOpenChange={(open) => !open && setSettlementData(null)}
          groupId={groupId}
          members={members}
          currency={currency}
          defaultPayerId={settlementData.payerId}
          defaultReceiverId={settlementData.receiverId}
          defaultAmount={settlementData.amount}
        />
      )}
    </>
  );
}
