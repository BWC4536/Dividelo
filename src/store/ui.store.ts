import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  expenseSheetOpen: boolean;
  setExpenseSheetOpen: (open: boolean) => void;
  editingExpenseId: string | null;
  setEditingExpenseId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  expenseSheetOpen: false,
  setExpenseSheetOpen: (open) => set({ expenseSheetOpen: open }),
  editingExpenseId: null,
  setEditingExpenseId: (id) => set({ editingExpenseId: id }),
}));
