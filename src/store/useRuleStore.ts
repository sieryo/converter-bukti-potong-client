import { create } from "zustand";



export interface RuleCondition {
  source: "bukpot" | "global";
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

export interface Rule {
  when: RuleCondition;
  then: RuleAction;
}

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
