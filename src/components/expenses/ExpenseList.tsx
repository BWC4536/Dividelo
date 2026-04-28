"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Expense } from "@/types";
import { ExpenseCard } from "./ExpenseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  groupId: string;
  currentUserId?: string;
  isLoading?: boolean;
  onAddExpense?: () => void;
}

function formatGroupDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Hoy";
  if (isYesterday(date)) return "Ayer";
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ExpenseList({
  expenses,
  groupId,
  currentUserId,
  isLoading,
  onAddExpense,
}: ExpenseListProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const expense of expenses) {
      const dateKey = expense.date.slice(0, 10);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(expense);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, gi) => (
          <div key={gi} className="space-y-3">
            <Skeleton className="h-4 w-28" />
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Sin gastos aún"
        description="Añade el primer gasto del grupo"
        icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
        action={
          onAddExpense
            ? { label: "Añadir primer gasto", onClick: onAddExpense }
            : undefined
        }
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {grouped.map(([dateKey, dayExpenses]) => (
        <motion.div key={dateKey} variants={itemVariants} className="space-y-2">
          <div className="sticky top-[calc(3.5rem+3rem)] z-10 -mx-4 px-4 py-1.5 bg-background/95 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {formatGroupDate(dateKey + "T00:00:00")}
            </p>
          </div>
          <div className="space-y-2">
            {dayExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                groupId={groupId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
