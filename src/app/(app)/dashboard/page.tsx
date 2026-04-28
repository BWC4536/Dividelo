import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BalanceSummary } from "@/components/dashboard/BalanceSummary";
import { GroupCard } from "@/components/dashboard/GroupCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id as string;

  const [memberships, recentExpenses] = await Promise.all([
    db.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: { select: { members: true, expenses: true } },
            members: { include: { user: true }, take: 4 },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
    db.expense.findMany({
      where: { group: { members: { some: { userId } } } },
      include: { paidBy: true, group: true, splits: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const splits = await db.expenseSplit.findMany({
    where: { userId, isSettled: false },
    include: { expense: true },
  });

  let totalOwed = 0;
  let totalOwing = 0;

  for (const split of splits) {
    if (split.expense.paidById === userId) {
      totalOwed += split.amount;
    } else {
      totalOwing += split.amount;
    }
  }

  const activeGroups = memberships.filter((m) => !m.group.archived);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Hola, {session.user.name?.split(" ")[0] ?? "de nuevo"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aquí tienes tu resumen de gastos compartidos
          </p>
        </div>
        <QuickActions />
      </div>

      <BalanceSummary totalOwed={totalOwed} totalOwing={totalOwing} />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mis grupos</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/groups">Ver todos</Link>
          </Button>
        </div>
        {activeGroups.length === 0 ? (
          <EmptyState
            title="Sin grupos todavía"
            description="Crea tu primer grupo para empezar a dividir gastos"
            action={{ label: "Crear grupo", onClick: () => {} }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGroups.slice(0, 6).map((m) => (
              <GroupCard key={m.group.id} group={m.group as any} />
            ))}
          </div>
        )}
      </section>

      {recentExpenses.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Actividad reciente</h2>
          <RecentActivity expenses={recentExpenses as any} currentUserId={userId} />
        </section>
      )}
    </div>
  );
}
