"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  groupId?: string;
  onAddExpense?: () => void;
}

export function QuickActions({ groupId, onAddExpense }: QuickActionsProps) {
  return (
    <>
      {/* FAB - Add expense */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddExpense}
        className="fab"
        aria-label="Añadir gasto"
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      {/* Quick action buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <Link href="/groups/new">
            <Users className="h-4 w-4" />
            Nuevo grupo
          </Link>
        </Button>
        {onAddExpense && (
          <Button variant="gradient" size="sm" onClick={onAddExpense}>
            <Plus className="h-4 w-4" />
            Añadir gasto
          </Button>
        )}
      </div>
    </>
  );
}
