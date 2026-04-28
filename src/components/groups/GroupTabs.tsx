"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Receipt, BarChart2, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface GroupTabsProps {
  groupId: string;
}

const tabs = [
  { label: "Gastos", icon: Receipt, href: "expenses" },
  { label: "Balances", icon: BarChart2, href: "balances" },
  { label: "Miembros", icon: Users, href: "members" },
  { label: "Ajustes", icon: Settings, href: "settings" },
];

export function GroupTabs({ groupId }: GroupTabsProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-14 z-20 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const href = `/groups/${groupId}/${tab.href}`;
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "relative flex flex-1 min-w-0 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="group-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
