"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Bell,
  User,
  LogOut,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useGroups } from "@/hooks/useGroups";
import { useNotifications } from "@/hooks/useNotifications";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/groups", label: "Grupos", icon: Users },
  { href: "/notifications", label: "Notificaciones", icon: Bell },
  { href: "/profile", label: "Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { groups } = useGroups();
  const { unreadCount } = useNotifications();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">Dividelo</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4 shrink-0" />
                <span className="relative">{item.label}</span>
                {item.label === "Notificaciones" && unreadCount > 0 && (
                  <span className="relative ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent groups */}
        {groups.length > 0 && (
          <div className="mt-6">
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Grupos recientes
            </p>
            <div className="space-y-1">
              {groups.slice(0, 5).map((group) => {
                const isActive = pathname.startsWith(`/groups/${group.id}`);
                return (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}/expenses`}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div
                      className="h-6 w-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${Math.abs(group.name.charCodeAt(0) * 137) % 360}, 70%, 55%), hsl(${Math.abs(group.name.charCodeAt(0) * 137 + 60) % 360}, 70%, 45%))`,
                      }}
                    >
                      {group.name[0].toUpperCase()}
                    </div>
                    <span className="truncate">{group.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer / User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <UserAvatar
            name={session?.user?.name}
            image={session?.user?.image}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name ?? "Usuario"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
