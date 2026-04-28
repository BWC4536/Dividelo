"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Expense, CATEGORIES } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatCurrency, formatRelativeDate } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentActivityProps {
  expenses: Expense[];
  isLoading?: boolean;
  currentUserId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RecentActivity({
  expenses,
  isLoading,
  currentUserId,
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Sin actividad reciente
      </p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {expenses.map((expense) => {
        const category = CATEGORIES[expense.category] ?? CATEGORIES.other;
        const userSplit = expense.splits.find(
          (s) => s.userId === currentUserId
        );
        const isPayer = expense.paidById === currentUserId;

        return (
          <motion.div key={expense.id} variants={itemVariants}>
            <Link
              href={`/groups/${expense.groupId}/expenses/${expense.id}`}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/50 transition-colors"
            >
              {/* Category icon */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: category.bgColor }}
              >
                {category.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {expense.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <UserAvatar
                    name={expense.paidBy?.name}
                    image={expense.paidBy?.image}
                    size="xs"
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {isPayer ? "Tú pagaste" : `Pagó ${expense.paidBy?.name}`}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelativeDate(expense.date)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
                {userSplit && !isPayer && (
                  <p className="text-xs text-red-500">
                    -{formatCurrency(userSplit.amount, expense.currency)}
                  </p>
                )}
                {isPayer && userSplit && (
                  <p className="text-xs text-emerald-500">
                    +
                    {formatCurrency(
                      expense.amount - userSplit.amount,
                      expense.currency
                    )}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
