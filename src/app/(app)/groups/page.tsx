import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GroupCard } from "@/components/dashboard/GroupCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Mis grupos" };

export default async function GroupsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const memberships = await db.groupMember.findMany({
    where: { userId: session.user.id as string },
    include: {
      group: {
        include: {
          _count: { select: { members: true, expenses: true } },
          members: { include: { user: true }, take: 4 },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const active = memberships.filter((m) => !m.group.archived);
  const archived = memberships.filter((m) => m.group.archived);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis grupos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} grupo{active.length !== 1 ? "s" : ""} activo{active.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/groups/new">
            <Plus className="h-4 w-4" />
            Nuevo grupo
          </Link>
        </Button>
      </div>

      {active.length === 0 ? (
        <EmptyState
          title="Aún no tienes grupos"
          description="Crea un grupo para empezar a dividir gastos con tus amigos"
          action={{ label: "Crear primer grupo", onClick: () => {} }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((m) => (
            <GroupCard key={m.group.id} group={m.group as any} />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-muted-foreground mb-3">Archivados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {archived.map((m) => (
              <GroupCard key={m.group.id} group={m.group as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
