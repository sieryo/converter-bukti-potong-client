import { Button } from "@/components/ui/button";
import { MAX_SIZE } from "@/constants/pdf";
import { errorMessage } from "@/utils/message";
import { Link } from "@tanstack/react-router";
import { Play, Download, Upload, Home } from "lucide-react";
import type { ChangeEvent } from "react";

interface ActionsPanelProps {
  onCheckDuplicate?: () => void;
  onValidate?: () => void;
  onConvert?: () => void;
  onExport?: () => void;
  onUpload?: (file: File) => void;
}

export function ActionsPanel({
  onConvert,
  onExport,
  onUpload,
  onValidate,
}: ActionsPanelProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      errorMessage(`File ${file.name} terlalu besar (maks 300 KB)`);
      e.target.value = "";
      return;
    }

    if (onUpload) {
      onUpload(file);
    }

    e.target.value = "";
  };

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col space-y-5">
      <h2 className="text-lg font-semibold">Aksi</h2>

      {/* Upload Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Upload</h3>
        <label className="w-full">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="secondary"
            className="flex items-center gap-2 w-full"
            asChild
          >
            <span>
              <Upload className="w-4 h-4" /> Upload File PDF
            </span>
          </Button>
        </label>
      </div>

      {/* Pengecekan Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Pengecekan</h3>
        <Button
          className="flex items-center gap-2 w-full"
          variant="ghost"
          onClick={onValidate}
        >
          <Play className="w-4 h-4" /> Validasi Semua File
        </Button>
      </div>

      {/* Konversi & Export Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Konversi</h3>
        <Button className="flex items-center gap-2 w-full" onClick={onConvert}>
          <Play className="w-4 h-4" /> Convert ke Excel
        </Button>
        {/* <Button
          variant="outline"
          className="flex items-center gap-2 w-full"
          onClick={onExport}
        >
          <Download className="w-4 h-4" /> Export Hasil
        </Button> */}
      </div>

      {/* Kembali Section */}
      <div className="space-y-2 pt-2 border-t">
        <h3 className="text-sm font-medium text-gray-600">Navigasi</h3>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full"
          asChild
        >
          <Link to="/home">
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
