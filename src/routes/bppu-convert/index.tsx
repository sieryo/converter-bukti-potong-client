// routes/bppu-convert/index.tsx
import { ActionsPanel } from "@/components/BppuActionPanel";
import type { PdfFile } from "@/components/PdfFileItem";
import { PdfFileList } from "@/components/PdfFileList";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/bppu-convert/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<PdfFile[]>([
    { name: "bppu-001.pdf", status: "pending" },
    {
      name: "bppu-002.pdf",
      status: "error",
      errors: ["Nomor pajak sudah ada di database"],
    },
    {
      name: "bppu-003.pdf",
      status: "error",
      errors: ["Format tidak sesuai", "Halaman 1 tidak terbaca"],
    },
    { name: "bppu-004.pdf", status: "valid" },
    { name: "bppu-005.pdf", status: "pending" },
    {
      name: "bppu-006.pdf",
      status: "error",
      errors: ["File kosong", "Tidak ada nomor pajak"],
    },
    { name: "bppu-007.pdf", status: "valid" },
    { name: "bppu-008.pdf", status: "pending" },
    { name: "bppu-009.pdf", status: "valid" },
    { name: "bppu-010.pdf", status: "error", errors: ["Halaman rusak"] },
    { name: "bppu-011.pdf", status: "valid" },
    { name: "bppu-012.pdf", status: "pending" },
    { name: "bppu-013.pdf", status: "valid" },
    { name: "bppu-014.pdf", status: "error", errors: ["Format tidak sesuai"] },
    { name: "bppu-015.pdf", status: "pending" },
    { name: "bppu-016.pdf", status: "valid" },
    {
      name: "bppu-017.pdf",
      status: "error",
      errors: ["Nomor pajak sudah ada di database", "Halaman 2 tidak terbaca"],
    },
    { name: "bppu-018.pdf", status: "pending" },
    { name: "bppu-019.pdf", status: "valid" },
    {
      name: "bppu-020.pdf",
      status: "error",
      errors: ["File tidak dapat dibuka"],
    },
    { name: "bppu-021.pdf", status: "valid" },
    { name: "bppu-022.pdf", status: "pending" },
    {
      name: "bppu-023.pdf",
      status: "error",
      errors: ["Format tidak sesuai", "Nomor pajak hilang"],
    },
    { name: "bppu-024.pdf", status: "valid" },
    { name: "bppu-025.pdf", status: "pending" },
  ]);

  return (
    <div className="h-screen p-4 flex flex-col">
      <h1 className="text-xl font-semibold mb-4">Converter BPPU Coretax</h1>

      <div className="grid grid-cols-3 gap-4 h-full">
        <PdfFileList files={files} />
        <ActionsPanel
          onCheckDuplicate={() => console.log("Check duplicate")}
          onValidate={() => console.log("Validate")}
          onConvert={() => console.log("Convert")}
          onExport={() => console.log("Export")}
        />
      </div>
    </div>
  );
}
