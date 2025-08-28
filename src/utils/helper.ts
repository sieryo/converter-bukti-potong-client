import type { Profile } from "@/store/useProfileStore";

export const mapProfileToLabel = (profile: Profile | {}) => {
  const result = Object.entries(profile || {})
    .filter(([key]) => !["id"].includes(key))
    .map(([key]) => {
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
      }

      return label;
    });

    return result
};
