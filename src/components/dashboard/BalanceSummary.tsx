"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils/cn";

interface BalanceSummaryProps {
  totalOwed: number;
  totalOwing: number;
  currency?: string;
}

export function BalanceSummary({
  totalOwed,
  totalOwing,
  currency = "EUR",
}: BalanceSummaryProps) {
  const netBalance = totalOwed - totalOwing;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Te deben */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-5 text-white shadow-lg"
      >
        <div className="absolute top-3 right-3 opacity-20">
          <TrendingUp className="h-12 w-12" />
        </div>
        <p className="text-sm font-medium text-emerald-100">Te deben</p>
        <AnimatedNumber
          value={totalOwed}
          currency={currency}
          className="mt-1 text-3xl font-bold tracking-tight"
        />
        <p className="mt-1 text-xs text-emerald-200">Saldo a tu favor</p>
      </motion.div>

      {/* Balance neto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "relative overflow-hidden rounded-2xl p-5 text-white shadow-lg",
          netBalance > 0
            ? "bg-gradient-to-br from-brand-500 to-violet-500"
            : netBalance < 0
            ? "bg-gradient-to-br from-red-400 to-red-600"
            : "bg-gradient-to-br from-gray-400 to-gray-600"
        )}
      >
        <div className="absolute top-3 right-3 opacity-20">
          {netBalance === 0 ? (
            <Minus className="h-12 w-12" />
          ) : netBalance > 0 ? (
            <TrendingUp className="h-12 w-12" />
          ) : (
            <TrendingDown className="h-12 w-12" />
          )}
        </div>
        <p className="text-sm font-medium text-white/80">Balance neto</p>
        <AnimatedNumber
          value={Math.abs(netBalance)}
          currency={currency}
          className="mt-1 text-3xl font-bold tracking-tight"
        />
        <p className="mt-1 text-xs text-white/60">
          {netBalance === 0
            ? "Estás al día"
            : netBalance > 0
            ? "A tu favor"
            : "Debes más de lo que te deben"}
        </p>
      </motion.div>

      {/* Debes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 to-red-600 p-5 text-white shadow-lg"
      >
        <div className="absolute top-3 right-3 opacity-20">
          <TrendingDown className="h-12 w-12" />
        </div>
        <p className="text-sm font-medium text-red-100">Debes</p>
        <AnimatedNumber
          value={totalOwing}
          currency={currency}
          className="mt-1 text-3xl font-bold tracking-tight"
        />
        <p className="mt-1 text-xs text-red-200">Pendiente de pagar</p>
      </motion.div>
    </div>
  );
}
