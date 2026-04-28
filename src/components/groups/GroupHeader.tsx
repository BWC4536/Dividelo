"use client";

import Image from "next/image";
import { MoreVertical, Settings, UserPlus, Archive, LogOut } from "lucide-react";
import { Group } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { generateGradient } from "@/lib/utils/cn";
import Link from "next/link";

interface GroupHeaderProps {
  group: Group;
  currentUserId?: string;
}

export function GroupHeader({ group, currentUserId }: GroupHeaderProps) {
  const isOwner = group.createdById === currentUserId;
  const gradient = generateGradient(group.name);
  const memberCount = group._count?.members ?? group.members?.length ?? 0;

  return (
    <div className="relative h-44 md:h-52 overflow-hidden">
      {group.imageUrl ? (
        <Image
          src={group.imageUrl}
          alt={group.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="h-full w-full" style={{ background: gradient }} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              {group.name}
            </h1>
            {group.description && (
              <p className="mt-1 text-sm text-white/70 line-clamp-2">
                {group.description}
              </p>
            )}
            <p className="mt-1 text-xs text-white/60">
              {memberCount} miembro{memberCount !== 1 ? "s" : ""} ·{" "}
              {group.currency}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white hover:bg-white/20 border border-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/groups/${group.id}/members`}>
                  <UserPlus className="h-4 w-4" />
                  Invitar miembros
                </Link>
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/groups/${group.id}/settings`}>
                      <Settings className="h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/groups/${group.id}/settings`}
                      className="text-destructive focus:text-destructive"
                    >
                      <Archive className="h-4 w-4" />
                      Archivar grupo
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {!isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Salir del grupo
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
