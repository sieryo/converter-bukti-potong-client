import { Button } from "@/components/ui/button";
import { MAX_SIZE } from "@/constants/pdf";
import { useApiLoadingStore } from "@/store/useApiLoading";
import { errorMessage } from "@/utils/message";
import { Link } from "@tanstack/react-router";
import { Play, Upload, Home } from "lucide-react";
import type { ChangeEvent } from "react";

interface ActionsPanelProps {
  onCheckDuplicate?: () => void;
  onValidate?: () => void;
  onConvert?: () => void;
  onExport?: () => void;
  onUpload?: (files: File[]) => void;
}

export function ActionsPanel({
  onConvert,
  onUpload,
  onValidate,
}: ActionsPanelProps) {
  const { isLoading } = useApiLoadingStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_SIZE) {
        errorMessage(`File ${file.name} terlalu besar (maks 300 KB)`);
        return false;
      }
      return true;
    });

    if (onUpload && validFiles.length > 0) {
      onUpload(validFiles);
    }

    e.target.value = "";
  };

  return (
    <div className="panel flex flex-col space-y-5 p-5 motion-rise">
      <h2 className="font-tiempos text-2xl text-zinc-900">Aksi</h2>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Upload
        </h3>
        <label className="w-full">
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="secondary"
            className="flex w-full items-center gap-2 border border-zinc-300/70 bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            asChild
            disabled={isLoading}
          >
            <span>
              <Upload className="w-4 h-4" /> Upload File PDF
            </span>
          </Button>
        </label>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Pengecekan
        </h3>
        <Button
          className="flex w-full items-center gap-2 border border-zinc-300/70 text-zinc-700 hover:bg-zinc-100"
          variant="ghost"
          onClick={onValidate}
          disabled={isLoading}
        >
          <Play className="w-4 h-4" /> Validasi Semua File
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Konversi
        </h3>
        <Button
          className="flex w-full items-center gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
          disabled={isLoading}
          onClick={onConvert}
        >
          <Play className="w-4 h-4" /> Convert ke Excel
        </Button>
      </div>

      <div className="space-y-2 border-t border-zinc-300/70 pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Navigasi
        </h3>
        <Button
          variant="ghost"
          className="flex w-full items-center gap-2 border border-zinc-300/70 text-zinc-700 hover:bg-zinc-100"
          asChild
        >
          <Link to="/home" disabled={isLoading}>
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
