export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", label: "Comida y bebida", icon: "🍕", color: "#f97316" },
  { id: "transport", label: "Transporte", icon: "🚗", color: "#3b82f6" },
  { id: "accommodation", label: "Alojamiento", icon: "🏨", color: "#8b5cf6" },
  { id: "entertainment", label: "Entretenimiento", icon: "🎉", color: "#ec4899" },
  { id: "shopping", label: "Compras", icon: "🛍️", color: "#f59e0b" },
  { id: "health", label: "Salud", icon: "💊", color: "#22c55e" },
  { id: "sports", label: "Deportes", icon: "⚽", color: "#06b6d4" },
  { id: "education", label: "Educación", icon: "📚", color: "#6366f1" },
  { id: "utilities", label: "Servicios", icon: "💡", color: "#84cc16" },
  { id: "travel", label: "Viajes", icon: "✈️", color: "#14b8a6" },
  { id: "other", label: "Otros", icon: "📦", color: "#6b7280" },
];

export function getCategoryById(id: string): Category {
  return (
    EXPENSE_CATEGORIES.find((c) => c.id === id) ??
    EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  );
}

export const CATEGORY_IDS = EXPENSE_CATEGORIES.map((c) => c.id);
