"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { useUIStore } from "@/store/ui.store";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-8 w-8"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
      {title && (
        <h1 className="text-base font-semibold text-foreground flex-1 md:flex-none">
          {title}
        </h1>
      )}
      <div className="ml-auto flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}
