// User types
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  currency: string;
  createdById: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  members?: GroupMember[];
  _count?: {
    members: number;
    expenses: number;
  };
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
  user: User;
  balance?: number;
}

// Expense types
export type ExpenseCategory =
  | "food"
  | "transport"
  | "accommodation"
  | "entertainment"
  | "shopping"
  | "utilities"
  | "health"
  | "sport"
  | "travel"
  | "education"
  | "gifts"
  | "other";

export interface Expense {
  id: string;
  groupId: string;
  paidById: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string | null;
  receiptUrl: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  paidBy: User;
  splits: ExpenseSplit[];
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amount: number;
  isSettled: boolean;
  user: User;
}

// Balance types
export interface Balance {
  userId: string;
  user: User;
  amount: number; // positive = owed to user, negative = user owes
}

export interface Debt {
  from: User;
  to: User;
  amount: number;
}

// Settlement types
export interface Settlement {
  id: string;
  groupId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  currency: string;
  note: string | null;
  date: string;
  createdAt: string;
  payer: User;
  receiver: User;
}

// Comment types
export interface Comment {
  id: string;
  expenseId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

// Notification types
export type NotificationType =
  | "expense_added"
  | "expense_updated"
  | "expense_deleted"
  | "settlement_created"
  | "member_joined"
  | "member_left"
  | "group_updated"
  | "comment_added";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: string | null;
  read: boolean;
  createdAt: string;
}

// InviteToken types
export interface InviteToken {
  id: string;
  groupId: string;
  createdById: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
  group?: Group;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface CreateGroupInput {
  name: string;
  description?: string;
  currency: string;
  imageUrl?: string;
}

export interface UpdateGroupInput extends Partial<CreateGroupInput> {
  archived?: boolean;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  paidById: string;
  splits: {
    userId: string;
    amount: number;
  }[];
}

export interface CreateSettlementInput {
  payerId: string;
  receiverId: string;
  amount: number;
  note?: string;
  date?: string;
}

// Category config
export interface CategoryConfig {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryConfig> = {
  food: { label: "Comida", emoji: "🍕", color: "#f97316", bgColor: "#fff7ed" },
  transport: {
    label: "Transporte",
    emoji: "🚗",
    color: "#3b82f6",
    bgColor: "#eff6ff",
  },
  accommodation: {
    label: "Alojamiento",
    emoji: "🏠",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
  entertainment: {
    label: "Ocio",
    emoji: "🎬",
    color: "#ec4899",
    bgColor: "#fdf2f8",
  },
  shopping: {
    label: "Compras",
    emoji: "🛍️",
    color: "#f59e0b",
    bgColor: "#fffbeb",
  },
  utilities: {
    label: "Servicios",
    emoji: "💡",
    color: "#6366f1",
    bgColor: "#eef2ff",
  },
  health: { label: "Salud", emoji: "❤️", color: "#ef4444", bgColor: "#fef2f2" },
  sport: { label: "Deporte", emoji: "⚽", color: "#22c55e", bgColor: "#f0fdf4" },
  travel: { label: "Viaje", emoji: "✈️", color: "#06b6d4", bgColor: "#ecfeff" },
  education: {
    label: "Educación",
    emoji: "📚",
    color: "#84cc16",
    bgColor: "#f7fee7",
  },
  gifts: { label: "Regalos", emoji: "🎁", color: "#f43f5e", bgColor: "#fff1f2" },
  other: { label: "Otro", emoji: "📦", color: "#6b7280", bgColor: "#f9fafb" },
};

export const CURRENCIES = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
];
