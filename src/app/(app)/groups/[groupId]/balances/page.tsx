"use client";

import { useParams } from "next/navigation";
import { useGroup } from "@/hooks/useGroups";
import { useBalances, useSettlements } from "@/hooks/useBalances";
import { BalanceList } from "@/components/balances/BalanceList";
import { DebtSimplifier } from "@/components/balances/DebtSimplifier";
import { SettlementHistory } from "@/components/balances/SettlementHistory";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BalancesPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { balances, debts, isLoading } = useBalances(groupId);
  const { settlements } = useSettlements(groupId);
  const { group } = useGroup(groupId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="balances">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balances">Saldos</TabsTrigger>
          <TabsTrigger value="debts">Liquidar</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="mt-4">
          <BalanceList
            balances={balances}
            currency={group?.currency ?? "EUR"}
          />
        </TabsContent>

        <TabsContent value="debts" className="mt-4">
          <DebtSimplifier
            debts={debts}
            groupId={groupId}
            members={group?.members ?? []}
            currency={group?.currency ?? "EUR"}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SettlementHistory
            settlements={settlements}
            groupId={groupId}
            currency={group?.currency ?? "EUR"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
