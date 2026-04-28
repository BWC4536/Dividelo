export interface Balance {
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  balance: number; // positive = owed money, negative = owes money
}

export interface Debt {
  from: {
    userId: string;
    name: string;
    email: string;
    image?: string | null;
  };
  to: {
    userId: string;
    name: string;
    email: string;
    image?: string | null;
  };
  amount: number;
}

export interface BalanceResult {
  balances: Balance[];
  debts: Debt[];
  totalExpenses: number;
}

/**
 * Minimum cash flow algorithm to simplify debts.
 * Given a list of balances (positive = owed, negative = owes),
 * compute the minimum number of transactions to settle all debts.
 */
export function computeMinCashFlow(balances: Balance[]): Debt[] {
  const debts: Debt[] = [];

  // Create mutable copies
  const balanceMap = new Map<string, Balance & { net: number }>();
  for (const b of balances) {
    balanceMap.set(b.userId, { ...b, net: b.balance });
  }

  const users = Array.from(balanceMap.values());

  // Greedy algorithm: match largest creditor with largest debtor
  while (true) {
    // Sort by net amount
    users.sort((a, b) => a.net - b.net);

    const debtor = users[0]; // most negative
    const creditor = users[users.length - 1]; // most positive

    if (Math.abs(debtor.net) < 0.01 || creditor.net < 0.01) {
      break;
    }

    const amount = Math.min(Math.abs(debtor.net), creditor.net);
    const roundedAmount = Math.round(amount * 100) / 100;

    if (roundedAmount > 0) {
      debts.push({
        from: {
          userId: debtor.userId,
          name: debtor.name,
          email: debtor.email,
          image: debtor.image,
        },
        to: {
          userId: creditor.userId,
          name: creditor.name,
          email: creditor.email,
          image: creditor.image,
        },
        amount: roundedAmount,
      });
    }

    debtor.net += amount;
    creditor.net -= amount;
  }

  return debts;
}

export function calculateGroupBalances(
  members: Array<{
    userId: string;
    name: string;
    email: string;
    image?: string | null;
  }>,
  expenses: Array<{
    paidById: string;
    amount: number;
    splits: Array<{ userId: string; amount: number; isSettled: boolean }>;
  }>,
  settlements: Array<{ payerId: string; receiverId: string; amount: number }>
): BalanceResult {
  // Initialize balance map
  const netBalance = new Map<string, number>();
  for (const m of members) {
    netBalance.set(m.userId, 0);
  }

  let totalExpenses = 0;

  // Process expenses
  for (const expense of expenses) {
    totalExpenses += expense.amount;
    for (const split of expense.splits) {
      if (split.isSettled) continue;
      if (!netBalance.has(split.userId)) continue;
      if (!netBalance.has(expense.paidById)) continue;

      // The payer is owed money by the split participant
      if (split.userId !== expense.paidById) {
        netBalance.set(
          expense.paidById,
          (netBalance.get(expense.paidById) ?? 0) + split.amount
        );
        netBalance.set(
          split.userId,
          (netBalance.get(split.userId) ?? 0) - split.amount
        );
      }
    }
  }

  // Process settlements (reduce debts)
  for (const settlement of settlements) {
    if (netBalance.has(settlement.payerId)) {
      netBalance.set(
        settlement.payerId,
        (netBalance.get(settlement.payerId) ?? 0) + settlement.amount
      );
    }
    if (netBalance.has(settlement.receiverId)) {
      netBalance.set(
        settlement.receiverId,
        (netBalance.get(settlement.receiverId) ?? 0) - settlement.amount
      );
    }
  }

  const balances: Balance[] = members.map((m) => ({
    userId: m.userId,
    name: m.name,
    email: m.email,
    image: m.image,
    balance: Math.round((netBalance.get(m.userId) ?? 0) * 100) / 100,
  }));

  const debts = computeMinCashFlow(balances);

  return { balances, debts, totalExpenses };
}
