import { create } from "zustand";


export type Source =  "bukpot" | "profil"

type ConditionalRule = {
  type: "conditional";
  when: {
    source: Source;
    field: string;
    clause: string;
    value?: string;
  };
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



export interface RuleCondition {
  source: Source;
  field: string;
  clause: string;
  value?: string;
}

export interface RuleAction {
  type: string;
  value?: string; // for set_value
  fromField?: string; // for copy_field
  formula?: string; // for formula
}

export type Rule = ConditionalRule | DirectRule;

export interface RuleSet {
  header: string;
  rules: Rule[];
}

type RuleState = {
  rules: RuleSet[];
  addRule: (header: string, rule: Rule) => void;
  reset: () => void;
};

export const useRuleStore = create<RuleState>((set) => ({
  rules: [],
  addRule: (header, rule) =>
    set((state) => {
      const existingIndex = state.rules.findIndex((r) => r.header === header);

      if (existingIndex !== -1) {
        const updated = [...state.rules];
        updated[existingIndex] = {
          ...updated[existingIndex],
          rules: [...updated[existingIndex].rules, rule],
        };
        return { rules: updated };
      } else {
        return { rules: [...state.rules, { header, rules: [rule] }] };
      }
    }),
  reset: () => set({ rules: [] }),
}));
