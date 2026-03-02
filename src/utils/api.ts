import type { Profile } from "@/store/useProfileStore";
import type { ExportedRules } from "./rule";
import axios, { type AxiosResponse } from "axios";
import { BASE_API_PATH } from "@/lib/constants";
import type { BppuCoretax } from "@/types/bppu";
import type { RenameJobStatus } from "@/types/job";

type RenameMode = "by_category" | "by_nama_pegawai";

interface RenameFilesPayload {
  endpoint: string;
  files: File[];
  state?: RenameMode;
  mode?: RenameMode;
  mappingFile?: File | null;
  sheetName?: string;
}

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
    await handleErrorResponse(err);

    const response = err?.response;

    if (onAfterExport && response) {
      onAfterExport(response);
    }

    return { response };
  }
}

export async function convertBppu(bppu: BppuCoretax[]) {
  const formData = new FormData();

  bppu.forEach((file) => {
    if (file.file) {
      formData.append("files", file.file);
    }
  });

  const result = await axios.post(`${BASE_API_PATH}/convert_bppu`, formData, {
    responseType: "blob",
    headers: { "Content-Type": "multipart/form-data" },
  });

  return result;
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
    return;
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
  const exportedFileName = response.headers.get("X-Exported-Filename");


  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", exportedFileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function triggerDownload(response: any) {
  _triggerDownload(response);
}

export function handleErrorResponse(err: any): Promise<any> {
  return new Promise((resolve) => {
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
          resolve(json)
        } catch (parseError) {
          resolve({
            error: "Unknown Error"
          })
        }
      };
      reader.readAsText(err.response.data);
    } else {
      alert("err: " + (err.message || "Terjadi kesalahan"));

      resolve("Unknown Error")
    }
  })
}

export async function renameFiles(payload: RenameFilesPayload) {
  const formData = new FormData();
  payload.files.forEach((file) => {
    formData.append("files", file);
  });

  if (payload.state) {
    formData.append("state", payload.state);
  }

  if (payload.mode) {
    formData.append("mode", payload.mode);
  }

  if (payload.mappingFile) {
    formData.append("mapping_file", payload.mappingFile);
  }

  if (payload.sheetName?.trim()) {
    formData.append("sheet_name", payload.sheetName.trim());
  }

  const response = await axios.post(`${BASE_API_PATH}/${payload.endpoint}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // { job_id: string }
}

export async function getRenameProgress(jobId: string): Promise<RenameJobStatus> {
  const response = await axios.get(`${BASE_API_PATH}/progress/${jobId}`);
  return response.data;
}

function getFileNameFromDisposition(disposition: string | null) {
  if (!disposition) return null;
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (basicMatch?.[1]) {
    return basicMatch[1];
  }
  return null;
}

export async function downloadRenameResult(jobId: string) {
  const response = await axios.get(`${BASE_API_PATH}/download/${jobId}`, {
    responseType: "blob",
  });

  const exportedFileName =
    response.headers["x-exported-filename"] ??
    response.headers["X-Exported-Filename"];
  const fileName =
    exportedFileName ??
    getFileNameFromDisposition(response.headers["content-disposition"]) ??
    "renamed_files.zip";
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

