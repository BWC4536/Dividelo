"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { NotificationList } from "@/components/notifications/NotificationList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading } = useNotifications();

  if (isLoading) {
    return <div className="flex justify-center py-16"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount} sin leer
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="Sin notificaciones"
          description="Cuando haya actividad en tus grupos, aparecerá aquí"
        />
      ) : (
        <NotificationList notifications={notifications} unreadCount={unreadCount} />
      )}
    </div>
  );
}
