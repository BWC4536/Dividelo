"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGroup } from "@/hooks/useGroups";
import { MemberList } from "@/components/groups/MemberList";
import { InviteModal } from "@/components/groups/InviteModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session } = useSession();
  const { group, isLoading } = useGroup(groupId);
  const [inviteOpen, setInviteOpen] = useState(false);

  if (isLoading) {
    return <div className="flex justify-center py-16"><LoadingSpinner /></div>;
  }

  if (!group) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {group.members?.length ?? 0} miembro{(group.members?.length ?? 0) !== 1 ? "s" : ""}
        </p>
        <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Invitar
        </Button>
      </div>

      <MemberList
        members={group.members ?? []}
        currentUserId={session?.user?.id as string}
        currency={group.currency}
      />

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        groupId={groupId}
      />
    </div>
  );
}
