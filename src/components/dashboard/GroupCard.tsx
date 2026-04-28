"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Group } from "@/types";
import { cn, formatCurrency, generateGradient } from "@/lib/utils/cn";

interface GroupCardProps {
  group: Group;
  userBalance?: number;
}

export function GroupCard({ group, userBalance }: GroupCardProps) {
  const memberCount = group._count?.members ?? group.members?.length ?? 0;
  const gradient = generateGradient(group.name);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Link href={`/groups/${group.id}/expenses`} className="block">
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Hero image */}
          <div className="relative h-28 w-full">
            {group.imageUrl ? (
              <Image
                src={group.imageUrl}
                alt={group.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 350px"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: gradient }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <h3 className="font-bold text-base leading-tight drop-shadow">
                {group.name}
              </h3>
              {group.description && (
                <p className="text-xs text-white/75 mt-0.5 line-clamp-1">
                  {group.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">
                {memberCount} miembro{memberCount !== 1 ? "s" : ""}
              </span>
            </div>

            {userBalance !== undefined && (
              <span
                className={cn(
                  "text-xs font-semibold",
                  userBalance > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : userBalance < 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-muted-foreground"
                )}
              >
                {userBalance > 0
                  ? `+${formatCurrency(userBalance, group.currency)}`
                  : userBalance < 0
                  ? formatCurrency(userBalance, group.currency)
                  : "Al día"}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
