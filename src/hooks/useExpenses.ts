"use client";

import useSWR, { mutate } from "swr";
import { Expense, CreateExpenseInput } from "@/types";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Error al cargar datos");
    return res.json();
  });

export function useExpenses(groupId: string) {
  const { data, error, isLoading } = useSWR<Expense[]>(
    groupId ? `/api/groups/${groupId}/expenses` : null,
    fetcher
  );

  return {
    expenses: data ?? [],
    isLoading,
    error,
  };
}

export function useExpense(groupId: string, expenseId: string) {
  const { data, error, isLoading } = useSWR<Expense>(
    groupId && expenseId
      ? `/api/groups/${groupId}/expenses/${expenseId}`
      : null,
    fetcher
  );

  return {
    expense: data,
    isLoading,
    error,
  };
}

export async function createExpense(
  groupId: string,
  input: CreateExpenseInput
): Promise<Expense> {
  const res = await fetch(`/api/groups/${groupId}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear gasto");
  }

  const expense = await res.json();
  await mutate(`/api/groups/${groupId}/expenses`);
  await mutate(`/api/groups/${groupId}/balances`);
  return expense;
}

export async function updateExpense(
  groupId: string,
  expenseId: string,
  input: Partial<CreateExpenseInput>
): Promise<Expense> {
  const res = await fetch(`/api/groups/${groupId}/expenses/${expenseId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar gasto");
  }

  const expense = await res.json();
  await mutate(`/api/groups/${groupId}/expenses`);
  await mutate(`/api/groups/${groupId}/expenses/${expenseId}`);
  await mutate(`/api/groups/${groupId}/balances`);
  return expense;
}

export async function deleteExpense(
  groupId: string,
  expenseId: string
): Promise<void> {
  const res = await fetch(`/api/groups/${groupId}/expenses/${expenseId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al eliminar gasto");
  }

  await mutate(`/api/groups/${groupId}/expenses`);
  await mutate(`/api/groups/${groupId}/balances`);
}
