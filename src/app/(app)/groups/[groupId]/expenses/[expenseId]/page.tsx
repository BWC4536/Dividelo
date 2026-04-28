import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ExpenseDetail } from "@/components/expenses/ExpenseDetail";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ExpenseDetailPage({
  params,
}: {
  params: { groupId: string; expenseId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const expense = await db.expense.findUnique({
    where: { id: params.expenseId },
    include: {
      paidBy: true,
      splits: { include: { user: true } },
      comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!expense || expense.groupId !== params.groupId) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/groups/${params.groupId}/expenses`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Detalle del gasto</h1>
      </div>
      <ExpenseDetail
        expense={expense as any}
        currentUserId={session.user.id as string}
        groupId={params.groupId}
      />
    </div>
  );
}
