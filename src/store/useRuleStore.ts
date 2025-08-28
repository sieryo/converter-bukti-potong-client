import { create } from "zustand";

export type Source = "bukpot" | "profil";

// --------------------
// Row Filter
// --------------------
export interface RowFilter {
  source: Source;
  field: string;
  clause: string;
  compareWith: {
    type: string;
    value?: string;
  };
}

// --------------------
// Field Rules
// --------------------
type ConditionalRule = {
  type: "conditional";
  when: RowFilter;
  then: {
    type: string;
    value?: string;
    fromField?: string;
    formula?: string;
  };
};

type DirectRule = {
  type: "direct";
  then: {
    type: string;
    value?: string;
    fromField?: string;
    formula?: string;
  };
};

export type Rule = ConditionalRule | DirectRule;

export interface RuleSet {
  header: string;
  rules: Rule[];
}

// --------------------
// Zustand State
// --------------------
type RuleState = {
  rowFilters: RowFilter[];
  fieldRules: RuleSet[];
  addRowFilter: (filter: RowFilter) => void;
  addFieldRule: (header: string, rule: Rule) => void;
  removeRule: (header: string, index: number) => void;
  reset: () => void;
};

export const useRuleStore = create<RuleState>((set) => ({
  rowFilters: [],
  fieldRules: [],

  addRowFilter: (filter) =>
    set((state) => ({
      rowFilters: [...state.rowFilters, filter],
    })),

  addFieldRule: (header, rule) =>
    set((state) => {
      const existingIndex = state.fieldRules.findIndex(
        (r) => r.header === header
      );

      if (existingIndex !== -1) {
        const updated = [...state.fieldRules];
        updated[existingIndex] = {
          ...updated[existingIndex],
          rules: [...updated[existingIndex].rules, rule],
        };
        return { fieldRules: updated };
      } else {
        return {
          fieldRules: [...state.fieldRules, { header, rules: [rule] }],
        };
      }
    }),
  removeRule: (header: string, ruleIndex: number) =>
    set((state) => {
      const updated = state.fieldRules.map((rs) => {
        if (rs.header !== header) return rs;
        return {
          ...rs,
          rules: rs.rules.filter((_, idx) => idx !== ruleIndex),
        };
      });
      return { fieldRules: updated };
    }),

  reset: () => set({ rowFilters: [], fieldRules: [] }),
}));
