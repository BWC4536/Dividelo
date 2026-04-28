"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils/cn";

interface BalanceBarProps {
  amount: number;
  maxAbsAmount: number;
  currency?: string;
}

export function BalanceBar({ amount, maxAbsAmount, currency = "EUR" }: BalanceBarProps) {
  const percentage = maxAbsAmount > 0 ? Math.abs(amount) / maxAbsAmount : 0;
  const isPositive = amount >= 0;

  return (
    <div className="flex items-center gap-2">
      {/* Left side (negative) */}
      <div className="flex-1 flex justify-end">
        {!isPositive && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-2 rounded-full bg-red-500 dark:bg-red-400"
            style={{ maxWidth: "100%" }}
          />
        )}
      </div>

      {/* Center line */}
      <div className="relative flex-shrink-0">
        <div className="h-4 w-px bg-border" />
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
          0
        </span>
      </div>

      {/* Right side (positive) */}
      <div className="flex-1 flex justify-start">
        {isPositive && amount > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
            style={{ maxWidth: "100%" }}
          />
        )}
      </div>
    </div>
  );
}
