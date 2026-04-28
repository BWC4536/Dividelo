"use client";

import { motion } from "framer-motion";
import { Balance } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { BalanceBar } from "./BalanceBar";
import { formatCurrency, cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface BalanceListProps {
  balances: Balance[];
  currency?: string;
  isLoading?: boolean;
  currentUserId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function BalanceList({
  balances,
  currency = "EUR",
  isLoading,
  currentUserId,
}: BalanceListProps) {
  const maxAbsAmount = Math.max(...balances.map((b) => Math.abs(b.amount)), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Sin balances
      </p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {balances.map((balance) => {
        const isCurrentUser = balance.userId === currentUserId;

        return (
          <motion.div key={balance.userId} variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={balance.user?.name}
                image={balance.user?.image}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {balance.user?.name ?? "Usuario"}
                  {isCurrentUser && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      (tú)
                    </span>
                  )}
                </p>
                <p
                  className={cn(
                    "text-xs font-semibold",
                    balance.amount > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : balance.amount < 0
                      ? "text-red-500 dark:text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {balance.amount > 0
                    ? `Le deben ${formatCurrency(balance.amount, currency)}`
                    : balance.amount < 0
                    ? `Debe ${formatCurrency(Math.abs(balance.amount), currency)}`
                    : "Al día"}
                </p>
              </div>
              <span
                className={cn(
                  "text-sm font-bold font-mono",
                  balance.amount > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : balance.amount < 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-muted-foreground"
                )}
              >
                {balance.amount > 0 ? "+" : ""}
                {formatCurrency(balance.amount, currency)}
              </span>
            </div>
            <BalanceBar
              amount={balance.amount}
              maxAbsAmount={maxAbsAmount}
              currency={currency}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
