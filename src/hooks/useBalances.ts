"use client";

import useSWR, { mutate } from "swr";
import { Balance, Debt, Settlement, CreateSettlementInput } from "@/types";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Error al cargar datos");
    return res.json();
  });

interface BalancesData {
  balances: Balance[];
  debts: Debt[];
  totalOwed: number;
  totalOwing: number;
}

export function useBalances(groupId: string) {
  const { data, error, isLoading } = useSWR<BalancesData>(
    groupId ? `/api/groups/${groupId}/balances` : null,
    fetcher
  );

  return {
    balances: data?.balances ?? [],
    debts: data?.debts ?? [],
    totalOwed: data?.totalOwed ?? 0,
    totalOwing: data?.totalOwing ?? 0,
    isLoading,
    error,
  };
}

export function useSettlements(groupId: string) {
  const { data, error, isLoading } = useSWR<Settlement[]>(
    groupId ? `/api/groups/${groupId}/settlements` : null,
    fetcher
  );

  return {
    settlements: data ?? [],
    isLoading,
    error,
  };
}

export async function createSettlement(
  groupId: string,
  input: CreateSettlementInput
): Promise<Settlement> {
  const res = await fetch(`/api/groups/${groupId}/settlements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al registrar pago");
  }

  const settlement = await res.json();
  await mutate(`/api/groups/${groupId}/balances`);
  await mutate(`/api/groups/${groupId}/settlements`);
  return settlement;
}

export async function deleteSettlement(
  groupId: string,
  settlementId: string
): Promise<void> {
  const res = await fetch(
    `/api/groups/${groupId}/settlements/${settlementId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al anular pago");
  }

  await mutate(`/api/groups/${groupId}/balances`);
  await mutate(`/api/groups/${groupId}/settlements`);
}
