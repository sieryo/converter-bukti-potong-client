import { exportRules, importRules, type ExportedRules } from "@/utils/rule";
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

export interface ThenRule {
  action: string;
  value?: string;
  from?: {
    source: Source,
    field: string
  }
  formula?: string;
}

// --------------------
// Field Rules
// --------------------
type ConditionalRule = {
  type: "conditional";
  when: RowFilter;
  then: ThenRule;
};

type DirectRule = {
  type: "direct";
  then: ThenRule;
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
  removeFilter: (index: number) => void;
  exportAll: () => string;
  importAll: (json: string) => void;
  reset: () => void;
};

export const useRuleStore = create<RuleState>((set, get) => ({
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

  removeFilter: (filterIndex: number) =>
    set((state) => ({
      rowFilters: state.rowFilters.filter((_, idx) => idx !== filterIndex),
    })),

  exportAll: () => {
    const { rowFilters, fieldRules } = get();
    return exportRules(rowFilters, fieldRules);
  },

  importAll: (json: string) => {
    const imported: ExportedRules = importRules(json);
    set({
      rowFilters: imported.rowFilters,
      fieldRules: imported.fieldRules,
    });
  },

  reset: () => set({ rowFilters: [], fieldRules: [] }),
}));
