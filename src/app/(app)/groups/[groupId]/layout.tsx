import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { GroupTabs } from "@/components/groups/GroupTabs";

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { groupId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const group = await db.group.findUnique({
    where: { id: params.groupId },
    include: {
      members: { include: { user: true } },
      _count: { select: { expenses: true } },
    },
  });

  if (!group) notFound();

  const isMember = group.members.some((m) => m.userId === (session.user!.id as string));
  if (!isMember) redirect("/groups");

  const currentMember = group.members.find((m) => m.userId === (session.user!.id as string));

  return (
    <div className="space-y-0">
      <GroupHeader
        group={group as any}
        currentUserId={session.user.id as string}
      />
      <GroupTabs groupId={params.groupId} />
      <div className="pt-4">{children}</div>
    </div>
  );
}
