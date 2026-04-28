"use client";

import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { Notification } from "@/types";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { markAllRead } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationListProps {
  notifications: Notification[];
  isLoading?: boolean;
  unreadCount: number;
}

export function NotificationList({
  notifications,
  isLoading,
  unreadCount,
}: NotificationListProps) {
  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success("Todas marcadas como leídas");
    } catch {
      toast.error("Error al marcar notificaciones");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Notificaciones</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} sin leer
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4" />
            Marcar todas leídas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Bell className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold">Sin notificaciones</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Te avisaremos cuando haya novedades en tus grupos
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="space-y-2"
        >
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
