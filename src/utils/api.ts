import type { Profile } from "@/store/useProfileStore";
import type { ExportedRules } from "./rule";
import axios, { type AxiosResponse } from "axios";
import { BASE_API_PATH } from "@/lib/constants";

export async function convertBukpot(
  bukpotFile: File,
  rules: ExportedRules,
  profile: Profile,
  onBeforeExport?: () => void,
  onAfterExport?: (response: AxiosResponse<any, any>) => void
) {
  if (onBeforeExport) {
    onBeforeExport();
  }
  const formData = new FormData();
  formData.append("file", bukpotFile);

  formData.append("rules", JSON.stringify(rules));
  formData.append("profile", JSON.stringify(profile));

  try {
    const response = await axios.post(`${BASE_API_PATH}/convert`, formData, {
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    triggerDownload(response);

    if (onAfterExport) onAfterExport(response);

    return { response };
  } catch (err: any) {
    console.error("Upload error:", err);
    handleErrorResponse(err);

    const response = err?.response;

    if (onAfterExport && response) {
      onAfterExport(response);
    }

    return { response };
  }
}

function _triggerDownload(response: any) {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const exportedName = response.headers.get("X-Exported-Filename");

  let filename = `${exportedName}.xlsx`;

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function triggerDownload(response: any) {
  _triggerDownload(response);
}

function handleErrorResponse(err: any) {
  if (
    err.response &&
    err.response.data instanceof Blob &&
    err.response.data.type === "application/json"
  ) {
    const reader = new FileReader();
    reader.onload = function () {
      const errorText = reader.result;
      try {
        // @ts-expect-error
        const json = JSON.parse(errorText ?? "");
        throw new Error(json.detail || "Unknown Error");
      } catch (parseError) {
        throw new Error("Error:" + errorText);
      }
    };
    reader.readAsText(err.response.data);
  } else {
    alert("err: " + (err.message || "Terjadi kesalahan"));
  }
}
