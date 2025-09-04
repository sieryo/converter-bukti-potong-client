import type { Header } from "@/lib/ExcelProcessor";
import type { Profile } from "@/store/useProfileStore";

export const mapProfileToLabel = (profile: Profile | {}): Header[] => {
  return Object.entries(profile || {})
    .filter(([key]) => !["id"].includes(key))
    .map(([key, value]) => {
      let label = key;

      switch (key) {
        case "cutoffDate":
          label = "Tanggal Masa Pajak";
          break;
        case "npwp":
          label = "NPWP Pemotong";
          break;
        case "idTKU":
          label = "ID TKU Pemotong";
          break;
        case "alias":
          label = "Alias";
          break;
      }

      return {
        name: label,
        dataFormat: detectDataFormat(value),
      };
    });
};

function detectDataFormat(value: unknown): string | null {
  if (value == null) return null;

  if (typeof value === "number") return "number";
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return "date";
    return "string";
  }
  if (value instanceof Date) return "date";

  return "string";
}

export const handleExport = (text: string) => {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rules.json";
  link.click();
  URL.revokeObjectURL(url);
};
