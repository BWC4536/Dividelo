"use client";

import { motion } from "framer-motion";
import { Crown, Shield, User } from "lucide-react";
import { GroupMember } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberListProps {
  members: GroupMember[];
  currency?: string;
  isLoading?: boolean;
  currentUserId?: string;
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: User,
};

const roleLabels = {
  owner: "Propietario",
  admin: "Admin",
  member: "Miembro",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function MemberList({
  members,
  currency = "EUR",
  isLoading,
  currentUserId,
}: MemberListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {members.map((member) => {
        const role = (member.role as "owner" | "admin" | "member") ?? "member";
        const RoleIcon = roleIcons[role];
        const isCurrentUser = member.userId === currentUserId;

        return (
          <motion.div
            key={member.id}
            variants={itemVariants}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50",
              isCurrentUser && "border-primary/30 bg-primary/5"
            )}
          >
            <UserAvatar
              name={member.user?.name}
              image={member.user?.image}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">
                  {member.user?.name ?? "Usuario"}
                  {isCurrentUser && (
                    <span className="ml-1 text-xs text-muted-foreground">(tú)</span>
                  )}
                </p>
                <Badge
                  variant={role === "owner" ? "default" : "secondary"}
                  className="shrink-0 text-[10px] px-1.5"
                >
                  <RoleIcon className="h-2.5 w-2.5 mr-0.5" />
                  {roleLabels[role]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {member.user?.email}
              </p>
              {member.balance !== undefined && (
                <p
                  className={cn(
                    "text-xs font-semibold mt-0.5",
                    member.balance > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : member.balance < 0
                      ? "text-red-500 dark:text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {member.balance > 0
                    ? `+${formatCurrency(member.balance, currency)}`
                    : member.balance < 0
                    ? formatCurrency(member.balance, currency)
                    : "Al día"}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
