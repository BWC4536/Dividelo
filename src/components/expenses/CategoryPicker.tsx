"use client";

import { motion } from "framer-motion";
import { ExpenseCategory, CATEGORIES } from "@/types";
import { cn } from "@/lib/utils/cn";

interface CategoryPickerProps {
  value: ExpenseCategory;
  onChange: (category: ExpenseCategory) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const categories = Object.entries(CATEGORIES) as [
    ExpenseCategory,
    (typeof CATEGORIES)[ExpenseCategory]
  ][];

  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map(([key, config]) => {
        const isSelected = value === key;

        return (
          <motion.button
            key={key}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(key)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-200 border-2",
              isSelected
                ? "border-current shadow-sm"
                : "border-transparent hover:bg-muted"
            )}
            style={
              isSelected
                ? {
                    borderColor: config.color,
                    backgroundColor: config.bgColor,
                    color: config.color,
                  }
                : undefined
            }
          >
            <span className="text-xl leading-none">{config.emoji}</span>
            <span className="text-[10px] font-medium leading-tight text-center line-clamp-1 text-foreground">
              {config.label}
            </span>
            {isSelected && (
              <motion.div
                layoutId="category-ring"
                className="absolute -inset-px rounded-xl border-2"
                style={{ borderColor: config.color }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
