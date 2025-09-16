import { ActionsPanel } from "@/components/BppuActionPanel";
import FolderUploader from "@/components/FolderUploader";
import { PdfFileList } from "@/components/PdfFileList";
import { usePreventNavigation } from "@/hooks/usePreventNavigation";
import { useValidateStore } from "@/store/useValidateStore";
import { type BppuCoretax, type BppuValidation } from "@/types/bppu";
import { validateBppu } from "@/utils/api";
import { errorMessage, successMessage } from "@/utils/message";
import { generateUUID } from "@/utils/uuid";
import { createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useState } from "react";

export const Route = createFileRoute("/bppu-convert/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [bppuFiles, setBppuFiles] = useState<BppuCoretax[]>();
  const { addFiles, clear } = useValidateStore();

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

  const handleUploadFile = (file: File) => {
    const newFile: BppuCoretax = {
      id: generateUUID(),
      name: file.name,
      status: "pending",
      file,
    };

    setBppuFiles((prev) => (prev ? [...prev, newFile] : [newFile]));
    successMessage(`Berhasil menambahkan file ${file.name}`);
  };

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

      const result = await validateBppu(bppuFiles);

      if (!result) {
        successMessage("Semua file valid")
        return
      }
      const bppuResult: BppuValidation = result.data;

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
        errorMessage("Bad Request!");
      } else {
        errorMessage("Unexpected Error!");
        console.log("No response received:", error.message);
      }
    } finally {
      clear();
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
          onUpload={handleUploadFile}
          onCheckDuplicate={() => console.log("Check duplicate")}
          onValidate={handleValidate}
          onConvert={() => console.log("Convert")}
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}
