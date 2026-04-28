"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Receipt,
  Users,
  CheckCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Notification, NotificationType } from "@/types";
import { Button } from "@/components/ui/button";
import { formatRelativeDate, cn } from "@/lib/utils/cn";
import { markNotificationRead } from "@/hooks/useNotifications";

const typeIcons: Record<NotificationType, React.ElementType> = {
  expense_added: Receipt,
  expense_updated: Receipt,
  expense_deleted: Receipt,
  settlement_created: CheckCircle,
  member_joined: Users,
  member_left: Users,
  group_updated: Settings,
  comment_added: MessageSquare,
};

const typeColors: Record<NotificationType, string> = {
  expense_added: "text-blue-500 bg-blue-50 dark:bg-blue-900/30",
  expense_updated: "text-amber-500 bg-amber-50 dark:bg-amber-900/30",
  expense_deleted: "text-red-500 bg-red-50 dark:bg-red-900/30",
  settlement_created: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
  member_joined: "text-violet-500 bg-violet-50 dark:bg-violet-900/30",
  member_left: "text-gray-500 bg-gray-100 dark:bg-gray-800",
  group_updated: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30",
  comment_added: "text-pink-500 bg-pink-50 dark:bg-pink-900/30",
};

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const Icon = typeIcons[notification.type] ?? Bell;
  const colorClass = typeColors[notification.type] ?? "text-gray-500 bg-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-3 rounded-xl p-4 transition-colors",
        !notification.read
          ? "bg-primary/5 border border-primary/10"
          : "bg-card border border-border"
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight">{notification.title}</p>
          {!notification.read && (
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {formatRelativeDate(notification.createdAt)}
        </p>
      </div>

      {!notification.read && (
        <Button
          size="sm"
          variant="ghost"
          className="text-xs shrink-0 h-7"
          onClick={() => markNotificationRead(notification.id)}
        >
          Leído
        </Button>
      )}
    </motion.div>
  );
}
