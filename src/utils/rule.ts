import { type RowFilter, type RuleSet } from "@/store/useRuleStore";

export interface ExportedRules {
  rowFilters: RowFilter[];
  fieldRules: RuleSet[];
}

export const exportRules = (
  rowFilters: RowFilter[],
  fieldRules: RuleSet[]
): string => {
  const data: ExportedRules = { rowFilters, fieldRules };
  return JSON.stringify(data, null, 2);
};

export const importRules = (json: string): ExportedRules => {
  try {
    const parsed = JSON.parse(json) as ExportedRules;
    if (!parsed.rowFilters || !parsed.fieldRules) {
      throw new Error("Invalid rules format");
    }
    return parsed;
  } catch (err) {
    console.error("Failed to import rules:", err);
    throw new Error("Format rules tidak valid");
  }
};
