"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Expense, CATEGORIES } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatCurrency, formatRelativeDate } from "@/lib/utils/cn";

interface ExpenseCardProps {
  expense: Expense;
  groupId: string;
  currentUserId?: string;
}

export function ExpenseCard({ expense, groupId, currentUserId }: ExpenseCardProps) {
  const category = CATEGORIES[expense.category] ?? CATEGORIES.other;
  const isPayer = expense.paidById === currentUserId;
  const userSplit = expense.splits.find((s) => s.userId === currentUserId);

  let myShare: number | null = null;
  let shareLabel = "";
  if (isPayer && userSplit) {
    myShare = expense.amount - userSplit.amount;
    shareLabel = myShare > 0 ? `+${formatCurrency(myShare, expense.currency)}` : "";
  } else if (userSplit) {
    myShare = -userSplit.amount;
    shareLabel = formatCurrency(userSplit.amount, expense.currency);
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Link href={`/groups/${groupId}/expenses/${expense.id}`}>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
          {/* Category icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
            style={{ backgroundColor: category.bgColor }}
          >
            {category.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {expense.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <UserAvatar
                name={expense.paidBy?.name}
                image={expense.paidBy?.image}
                size="xs"
              />
              <span className="text-xs text-muted-foreground">
                {isPayer ? "Tú pagaste" : `Pagó ${expense.paidBy?.name}`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatRelativeDate(expense.date)}
            </p>
          </div>

          {/* Amounts */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(expense.amount, expense.currency)}
            </p>
            {shareLabel && (
              <p
                className={
                  (myShare ?? 0) >= 0
                    ? "text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-xs text-red-500 dark:text-red-400 font-medium"
                }
              >
                {(myShare ?? 0) >= 0 ? "+" : ""}{shareLabel}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
