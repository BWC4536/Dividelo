"use client";

import { useParams } from "next/navigation";
import { useExpenses } from "@/hooks/useExpenses";
import { useGroup } from "@/hooks/useGroups";
import { useSession } from "next-auth/react";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

export default function ExpensesPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session } = useSession();
  const { expenses, isLoading } = useExpenses(groupId);
  const { group } = useGroup(groupId);
  const { expenseSheetOpen, setExpenseSheetOpen } = useUIStore();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {expenses.length} gasto{expenses.length !== 1 ? "s" : ""}
        </p>
        <Button variant="gradient" size="sm" onClick={() => setExpenseSheetOpen(true)}>
          <Plus className="h-4 w-4" />
          Añadir gasto
        </Button>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="Sin gastos todavía"
          description="Añade el primer gasto del grupo"
          action={{ label: "Añadir gasto", onClick: () => setExpenseSheetOpen(true) }}

        />
      ) : (
        <ExpenseList
          expenses={expenses}
          currentUserId={session?.user?.id as string}
          groupId={groupId}
        />
      )}

      {group && session?.user && (
        <ExpenseForm
          open={expenseSheetOpen}
          onOpenChange={setExpenseSheetOpen}
          groupId={groupId}
          members={group.members ?? []}
          currentUserId={session.user.id as string}
          currency={group.currency}
        />
      )}
    </div>
  );
}
