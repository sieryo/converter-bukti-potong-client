import type { Profile } from "@/store/useProfileStore";
import type { ExportedRules } from "./rule";
import axios, { type AxiosResponse } from "axios";
import { BASE_API_PATH } from "@/lib/constants";
import { errorMessage } from "./message";
import type { BppuCoretax } from "@/types/bppu";

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

export async function validateBppu(bppu: BppuCoretax[]) {
  const formData = new FormData();

  const filesWithIds: { id: string; name: string }[] = [];

  bppu.forEach((file) => {
    if ((file.status === "pending" || file.status === "error") && file.file) {
      formData.append("files", file.file);
      filesWithIds.push({
        id: file.id,
        name: file.name,
      });
    }
  });

  if (filesWithIds.length == 0) {
    return
  }

  if (filesWithIds.length > 0) {
    formData.append("files_meta", JSON.stringify(filesWithIds));
  }

  const validDataList = bppu
    .filter((f) => f.status === "valid" && f.data?.nomorBukpot)
    .map((f) => ({
      id: f.id,
      name: f.name,
      nomorBukpot: f.data!.nomorBukpot,
    }));

  if (validDataList.length > 0) {
    formData.append("valid_files_meta", JSON.stringify(validDataList));
  }

  const result = await axios.post(`${BASE_API_PATH}/validate_bppu`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return result;
}

function _triggerDownload(response: any) {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const exportedName = response.headers.get("X-Exported-Filename");

  let filename = `${exportedName}.zip`;

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
        errorMessage(json.detail || "Unknown Error");
      } catch (parseError) {
        errorMessage("Error:" + errorText);
      }
    };
    reader.readAsText(err.response.data);
  } else {
    alert("err: " + (err.message || "Terjadi kesalahan"));
  }
}
