"use client";

import useSWR, { mutate } from "swr";
import { Notification } from "@/types";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Error al cargar datos");
    return res.json();
  });

export function useNotifications() {
  const { data, error, isLoading } = useSWR<Notification[]>(
    "/api/notifications",
    fetcher,
    { refreshInterval: 30000 }
  );

  const unreadCount = (data ?? []).filter((n) => !n.read).length;

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readAll: true }) });
    await mutate("/api/notifications");
  };

  return {
    notifications: data ?? [],
    unreadCount,
    isLoading,
    error,
    markAllRead,
  };
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}/read`, { method: "POST" });
  await mutate("/api/notifications");
}

export async function markAllRead(): Promise<void> {
  await fetch("/api/notifications/read-all", { method: "POST" });
  await mutate("/api/notifications");
}
