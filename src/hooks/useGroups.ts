"use client";

import useSWR, { mutate } from "swr";
import { Group, CreateGroupInput, UpdateGroupInput } from "@/types";
import { toast } from "sonner";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Error al cargar datos");
    return res.json();
  });

export function useGroups() {
  const { data, error, isLoading } = useSWR<Group[]>("/api/groups", fetcher);

  return {
    groups: data ?? [],
    isLoading,
    error,
  };
}

export function useGroup(groupId: string) {
  const { data, error, isLoading } = useSWR<Group>(
    groupId ? `/api/groups/${groupId}` : null,
    fetcher
  );

  return {
    group: data,
    isLoading,
    error,
  };
}

export async function createGroup(input: CreateGroupInput): Promise<Group> {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear grupo");
  }

  const group = await res.json();
  await mutate("/api/groups");
  return group;
}

export async function updateGroup(
  groupId: string,
  input: UpdateGroupInput
): Promise<Group> {
  const res = await fetch(`/api/groups/${groupId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar grupo");
  }

  const group = await res.json();
  await mutate("/api/groups");
  await mutate(`/api/groups/${groupId}`);
  return group;
}

export async function deleteGroup(groupId: string): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al eliminar grupo");
  }

  await mutate("/api/groups");
}

export async function leaveGroup(groupId: string): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/leave`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al salir del grupo");
  }

  await mutate("/api/groups");
}
