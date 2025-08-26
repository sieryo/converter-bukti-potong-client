import { create } from "zustand";

type Rule = {
  header: string;
  rules: any[];
};

type FormulaState = {
  formulas: Rule[];
  addFormula: (formula: Rule) => void;
  reset: () => void;
};

export const useFormulaStore = create<FormulaState>((set) => ({
  formulas: [],
  addFormula: (formula) =>
    set((state) => ({ formulas: [...state.formulas, formula] })),
  reset: () => set({ formulas: [] }),
}));
