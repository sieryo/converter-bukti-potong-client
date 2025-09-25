import { ActionsPanel } from "@/components/BppuActionPanel";
import FolderUploader from "@/components/FolderUploader";
import { PdfFileList } from "@/components/PdfFileList";
import { usePreventNavigation } from "@/hooks/usePreventNavigation";
import { useApiLoadingStore } from "@/store/useApiLoading";
import { useValidateStore } from "@/store/useValidateStore";
import { type BppuCoretax, type BppuValidation } from "@/types/bppu";
import { convertBppu, triggerDownload, validateBppu } from "@/utils/api";
import { errorMessage, successMessage } from "@/utils/message";
import { generateUUID } from "@/utils/uuid";
import { createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/bppu-convert/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [bppuFiles, setBppuFiles] = useState<BppuCoretax[]>();
  const { addFiles, clear } = useValidateStore();
  const { setIsLoading } = useApiLoadingStore();

  usePreventNavigation(
    !!bppuFiles && bppuFiles.length > 0,
    "Ada file BPPU yang sudah diupload. Yakin mau keluar?"
  );

  const handleSuccessUpload = (bppu: BppuCoretax[]) => {
    setBppuFiles(bppu);
  };

  const handleDeleteFile = (target: BppuCoretax) => {
    setBppuFiles((prev) =>
      prev ? prev.filter((f) => f.id !== target.id) : prev
    );
    successMessage(`Berhasil menghapus file ${target.name}`);
  };

  const handleUploadFiles = (files: File[]) => {
    const newFiles: BppuCoretax[] = files.map((file) => ({
      id: generateUUID(),
      name: file.name,
      status: "pending",
      file,
    }));

    setBppuFiles((prev) => (prev ? [...prev, ...newFiles] : newFiles));

    if (newFiles.length === 1) {
      successMessage(`Berhasil menambahkan file ${newFiles[0].name}`);
    } else {
      successMessage(`Berhasil menambahkan ${newFiles.length} file`);
    }
  };

  const handleConvert = useCallback(async () => {
    if (!bppuFiles || bppuFiles.length === 0) return;

    setIsLoading(true);
    const allValid = bppuFiles.every((file) => file.status === "valid");
    if (!allValid) {
      errorMessage(
        "Masih ada file yang belum valid, silahkan validasi kembali"
      );
      console.warn("Masih ada yang belum valid");
      setIsLoading(false);
      return;
    }
    const processingIds: string[] = [];

    bppuFiles.forEach((file) => {
      processingIds.push(file.id);
    });

    addFiles(processingIds);

    try {
      const response = await convertBppu(bppuFiles);

      if (response.status == 200) {
        triggerDownload(response);
        successMessage("Berhasil convert!");
      } else {
        errorMessage(`Error :  ${response.statusText}`);
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.log(error.response);
        errorMessage("Bad Request!");
      } else {
        errorMessage("Unexpected Error! Maybe network?");
        console.log("No response received:", error.message);
      }
    } finally {
      clear();
      setIsLoading(false);
    }
  }, [bppuFiles]);

  const handleValidate = async () => {
    if (!bppuFiles) return;

    try {
      const processingIds: string[] = [];
      bppuFiles.forEach((file) => {
        if (
          (file.status === "pending" || file.status === "error") &&
          file.file
        ) {
          processingIds.push(file.id);
        }
      });

      addFiles(processingIds);
      setIsLoading(true);

      const response = await validateBppu(bppuFiles);

      if (!response) {
        successMessage("Semua file valid");
        return;
      }
      const bppuResult: BppuValidation = response.data;

      setBppuFiles(
        (prev) =>
          prev?.map((file) => {
            const apiResult = bppuResult.results.find((r) => r.id === file.id);
            if (!apiResult) return file;

            if (apiResult.error) {
              return {
                ...file,
                status: "error",
                errors: [
                  {
                    type: apiResult.error.type,
                    message: apiResult.error.message,
                    name: apiResult.error.name,
                    linkToId: apiResult.error.linkToId,
                  },
                ],
              };
            }

            return {
              ...file,
              status: "valid",
              data: { nomorBukpot: apiResult.nomorBukpot },
              errors: undefined,
            };
          }) ?? []
      );
      successMessage("Validasi berhasil dilakukan!");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.log(error.response);
        const resData = error.response.data as any;
        errorMessage(`Bad Request! ${resData.error}`);
      } else {
        errorMessage("Unexpected Error!");
        console.log("No response received:", error.message);
      }
    } finally {
      clear();
      setIsLoading(false);
    }
  };

  if (!bppuFiles) {
    return (
      <FolderUploader
        title="Upload Folder berisi BPPU"
        description="Silakan upload folder berisi file PDF BPPU Coretax terlebih dahulu untuk melanjutkan."
        onSuccessUpload={handleSuccessUpload}
      />
    );
  }

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="grid grid-cols-3 gap-4 h-full">
        <PdfFileList files={bppuFiles} onDelete={handleDeleteFile} />
        <ActionsPanel
          onUpload={handleUploadFiles}
          onCheckDuplicate={() => console.log("Check duplicate")}
          onValidate={handleValidate}
          onConvert={handleConvert}
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}
