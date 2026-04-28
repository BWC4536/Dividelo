"use client";

import Image from "next/image";
import { Expense, CATEGORIES } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, cn } from "@/lib/utils/cn";
import { CommentSection } from "./CommentSection";
import { Calendar, Receipt } from "lucide-react";

interface ExpenseDetailProps {
  expense: Expense;
  groupId: string;
  currentUserId?: string;
}

export function ExpenseDetail({
  expense,
  groupId,
  currentUserId,
}: ExpenseDetailProps) {
  const category = CATEGORIES[expense.category] ?? CATEGORIES.other;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: category.bgColor }}
        >
          {category.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">{expense.title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {category.label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(expense.date)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(expense.amount, expense.currency)}
          </p>
          <Badge variant="secondary" className="mt-1">
            {expense.currency}
          </Badge>
        </div>
      </div>

      {expense.description && (
        <p className="text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3">
          {expense.description}
        </p>
      )}

      <Separator />

      {/* Payer */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Pagó
        </p>
        <div className="flex items-center gap-3">
          <UserAvatar
            name={expense.paidBy?.name}
            image={expense.paidBy?.image}
            size="md"
          />
          <div>
            <p className="text-sm font-semibold">
              {expense.paidBy?.name ?? "Usuario"}
              {expense.paidById === currentUserId && (
                <span className="text-muted-foreground font-normal"> (tú)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Pagó {formatCurrency(expense.amount, expense.currency)}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Splits */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          División ({expense.splits.length} participantes)
        </p>
        <div className="space-y-2">
          {expense.splits.map((split) => {
            const isCurrentUser = split.userId === currentUserId;
            const isPayer = expense.paidById === split.userId;

            return (
              <div
                key={split.id}
                className="flex items-center gap-3 rounded-xl p-3 bg-muted/50"
              >
                <UserAvatar
                  name={split.user?.name}
                  image={split.user?.image}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {split.user?.name ?? "Usuario"}
                    {isCurrentUser && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        (tú)
                      </span>
                    )}
                  </p>
                  {isPayer && (
                    <p className="text-xs text-muted-foreground">Pagador</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatCurrency(split.amount, expense.currency)}
                  </p>
                  {split.isSettled && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Liquidado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Receipt */}
      {expense.receiptUrl && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Recibo
            </p>
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border">
              <Image
                src={expense.receiptUrl}
                alt="Recibo"
                fill
                className="object-cover"
                sizes="600px"
              />
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Comments */}
      <CommentSection
        comments={expense.comments ?? []}
        expenseId={expense.id}
        groupId={groupId}
        currentUserId={currentUserId}
      />
    </div>
  );
}
