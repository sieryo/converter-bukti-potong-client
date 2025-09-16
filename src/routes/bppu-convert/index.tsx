import { ActionsPanel } from "@/components/BppuActionPanel";
import FolderUploader from "@/components/FolderUploader";
import { PdfFileList } from "@/components/PdfFileList";
import { usePreventNavigation } from "@/hooks/usePreventNavigation";
import { type BppuCoretax } from "@/types/bppu";
import { successMessage } from "@/utils/message";
import { generateUUID } from "@/utils/uuid";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/bppu-convert/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [bppuFiles, setBppuFiles] = useState<BppuCoretax[]>([
    {
      id: "a-random-id",
      name: "BPPU-001.pdf",
      status: "pending",
    },
    {
      id: generateUUID(),
      name: "BPPU-002.pdf",
      status: "valid",
      data: {
        nomorBukpot: "2504GQX1",
      },
    },
    {
      id: generateUUID(),
      name: "BPPU-003.pdf",
      status: "error",
      errors: [
        {
          type: "duplicate",
          message:
            "Nomor bukti potong sudah ada pada file",
          name: "M_01-DOC001_SPT_Unifikasi_BPU_2504GQE0S",
          linkToId: "a-random-id",
        },
      ],
    },
  ]);

  usePreventNavigation(
    !!bppuFiles && bppuFiles.length > 0,
    "Ada file BPPU yang sudah diupload. Yakin mau keluar?"
  );

  const handleSuccessUpload = (bppu: BppuCoretax[]) => {
    setBppuFiles(bppu);
  };

  const handleDeleteFile = (target: BppuCoretax) => {
    setBppuFiles((prev) =>
      prev ? prev.filter((f) => f.name !== target.name) : prev
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
          onValidate={() => console.log("Validate")}
          onConvert={() => console.log("Convert")}
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}
