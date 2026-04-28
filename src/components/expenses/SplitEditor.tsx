"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Label } from "@/components/ui/label";
import { GroupMember } from "@/types";
import { formatCurrency, cn } from "@/lib/utils/cn";

interface SplitItem {
  userId: string;
  amount: number;
}

interface SplitEditorProps {
  members: GroupMember[];
  totalAmount: number;
  currency?: string;
  value: SplitItem[];
  onChange: (splits: SplitItem[]) => void;
}

type SplitMode = "equal" | "percentage" | "exact";

export function SplitEditor({
  members,
  totalAmount,
  currency = "EUR",
  value,
  onChange,
}: SplitEditorProps) {
  const [mode, setMode] = useState<SplitMode>("equal");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(members.map((m) => m.userId))
  );
  const [percentages, setPercentages] = useState<Record<string, number>>(
    Object.fromEntries(
      members.map((m) => [m.userId, Math.floor(100 / members.length)])
    )
  );
  const [exactAmounts, setExactAmounts] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.userId, ""]))
  );

  // Compute equal splits whenever selected members or total changes
  useEffect(() => {
    if (mode === "equal") {
      const selected = Array.from(selectedMembers);
      if (selected.length === 0) {
        onChange([]);
        return;
      }
      const perPerson = Math.round((totalAmount / selected.length) * 100) / 100;
      const splits = selected.map((userId, i) => ({
        userId,
        amount:
          i === selected.length - 1
            ? Math.round((totalAmount - perPerson * (selected.length - 1)) * 100) / 100
            : perPerson,
      }));
      onChange(splits);
    }
  }, [mode, selectedMembers, totalAmount]);

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handlePercentageChange = (userId: string, pct: number) => {
    const newPct = { ...percentages, [userId]: pct };
    setPercentages(newPct);
    const splits = members.map((m) => ({
      userId: m.userId,
      amount: Math.round(((newPct[m.userId] ?? 0) / 100) * totalAmount * 100) / 100,
    }));
    onChange(splits);
  };

  const handleExactChange = (userId: string, val: string) => {
    const newAmounts = { ...exactAmounts, [userId]: val };
    setExactAmounts(newAmounts);
    const splits = members.map((m) => ({
      userId: m.userId,
      amount: parseFloat(newAmounts[m.userId] ?? "0") || 0,
    }));
    onChange(splits);
  };

  const totalPct = Object.values(percentages).reduce((a, b) => a + b, 0);
  const totalExact = Object.values(exactAmounts).reduce(
    (a, b) => a + (parseFloat(b) || 0),
    0
  );
  const remaining = Math.round((totalAmount - totalExact) * 100) / 100;

  const equalPerPerson =
    selectedMembers.size > 0
      ? Math.round((totalAmount / selectedMembers.size) * 100) / 100
      : 0;

  return (
    <div className="space-y-3">
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as SplitMode)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="equal" className="flex-1 text-xs">
            Igual
          </TabsTrigger>
          <TabsTrigger value="percentage" className="flex-1 text-xs">
            Porcentaje
          </TabsTrigger>
          <TabsTrigger value="exact" className="flex-1 text-xs">
            Exacto
          </TabsTrigger>
        </TabsList>

        {/* Equal split */}
        <TabsContent value="equal" className="mt-3 space-y-2">
          {selectedMembers.size > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              {formatCurrency(equalPerPerson, currency)} por persona
            </p>
          )}
          {members.map((member) => {
            const selected = selectedMembers.has(member.userId);
            return (
              <div
                key={member.userId}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleMember(member.userId)}
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => toggleMember(member.userId)}
                  onClick={(e) => e.stopPropagation()}
                />
                <UserAvatar
                  name={member.user?.name}
                  image={member.user?.image}
                  size="xs"
                />
                <span className="flex-1 text-sm">
                  {member.user?.name ?? "Usuario"}
                </span>
                {selected && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatCurrency(equalPerPerson, currency)}
                  </span>
                )}
              </div>
            );
          })}
        </TabsContent>

        {/* Percentage split */}
        <TabsContent value="percentage" className="mt-3 space-y-2">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total asignado</span>
              <span
                className={cn(
                  "font-semibold",
                  Math.abs(totalPct - 100) < 0.01
                    ? "text-emerald-600"
                    : "text-amber-600"
                )}
              >
                {totalPct}%
              </span>
            </div>
            <Progress
              value={Math.min(totalPct, 100)}
              className={cn(
                "h-1.5",
                Math.abs(totalPct - 100) < 0.01
                  ? "[&>div]:bg-emerald-500"
                  : "[&>div]:bg-amber-500"
              )}
            />
          </div>
          {members.map((member) => (
            <div key={member.userId} className="flex items-center gap-3">
              <UserAvatar
                name={member.user?.name}
                image={member.user?.image}
                size="xs"
              />
              <span className="flex-1 text-sm min-w-0 truncate">
                {member.user?.name ?? "Usuario"}
              </span>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={percentages[member.userId] ?? 0}
                  onChange={(e) =>
                    handlePercentageChange(member.userId, Number(e.target.value))
                  }
                  className="w-16 h-7 text-xs text-right"
                />
                <span className="text-xs text-muted-foreground">%</span>
                <span className="text-xs font-mono text-muted-foreground w-16 text-right">
                  {formatCurrency(
                    ((percentages[member.userId] ?? 0) / 100) * totalAmount,
                    currency
                  )}
                </span>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Exact amounts */}
        <TabsContent value="exact" className="mt-3 space-y-2">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {remaining >= 0 ? "Sin asignar" : "Exceso"}
              </span>
              <span
                className={cn(
                  "font-semibold font-mono",
                  Math.abs(remaining) < 0.01
                    ? "text-emerald-600"
                    : "text-amber-600"
                )}
              >
                {formatCurrency(Math.abs(remaining), currency)}
              </span>
            </div>
            <Progress
              value={Math.min((totalExact / totalAmount) * 100, 100)}
              className={cn(
                "h-1.5",
                Math.abs(remaining) < 0.01
                  ? "[&>div]:bg-emerald-500"
                  : "[&>div]:bg-amber-500"
              )}
            />
          </div>
          {members.map((member) => (
            <div key={member.userId} className="flex items-center gap-3">
              <UserAvatar
                name={member.user?.name}
                image={member.user?.image}
                size="xs"
              />
              <span className="flex-1 text-sm min-w-0 truncate">
                {member.user?.name ?? "Usuario"}
              </span>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={exactAmounts[member.userId] ?? ""}
                onChange={(e) =>
                  handleExactChange(member.userId, e.target.value)
                }
                className="w-24 h-7 text-xs text-right font-mono"
              />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
