import { MAX_SIZE } from "@/constants/pdf";
import type { BppuCoretax } from "@/types/bppu";
import { errorMessage, successMessage } from "@/utils/message";
import { generateUUID } from "@/utils/uuid";
import { cn } from "@/lib/utils";
import { CheckCircle2, FolderOpen, Loader2, Upload } from "lucide-react";
import { useId, useMemo, useState } from "react";

export default function FolderUploader({
  title,
  description,
  onSuccessUpload,
}: {
  title: string;
  description: string;
  onSuccessUpload: (bppu: BppuCoretax[]) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const inputId = useId();

  const status = useMemo(() => {
    if (isProcessing) {
      return {
        label: "Membaca isi folder...",
        className: "border-zinc-400 bg-zinc-200/80 text-zinc-700",
      };
    }
    if (lastError) {
      return {
        label: lastError,
        className: "border-zinc-500 bg-zinc-200 text-zinc-800",
      };
    }
    if (selectedCount > 0) {
      return {
        label: `${selectedCount} file PDF siap diproses`,
        className: "border-zinc-500 bg-zinc-900 text-zinc-50",
      };
    }
    return {
      label: "Belum ada folder dipilih",
      className: "border-zinc-300 bg-zinc-100 text-zinc-600",
    };
  }, [isProcessing, lastError, selectedCount]);

  const processFiles = (files: FileList | null) => {
    try {
      if (!files || files.length === 0) return;
      setIsProcessing(true);
      setLastError(null);
      setSelectedCount(0);

      let arrayFiles = Array.from(files);

      arrayFiles = arrayFiles.filter((file) => file.type === "application/pdf");

      if (arrayFiles.length === 0) {
        setLastError("Tidak ada file PDF pada folder");
        errorMessage("Tidak ada file PDF pada folder yang dipilih");
        return;
      }

      const oversizedFiles = arrayFiles.filter((file) => file.size > MAX_SIZE);
      if (oversizedFiles.length > 0) {
        const oversizedNames = oversizedFiles.map((f) => f.name).join(", ");
        errorMessage(`File terlalu besar (maks 300 KB): ${oversizedNames}`);
        arrayFiles = arrayFiles.filter((file) => file.size <= MAX_SIZE);
      }

      if (arrayFiles.length === 0) {
        setLastError("Semua file melebihi ukuran maksimum");
        return;
      }

      const results: BppuCoretax[] = arrayFiles.map((f) => {
        const name = f.name;
        return {
          id: generateUUID(),
          name,
          status: "pending",
          file: f,
        };
      });

      setSelectedCount(results.length);
      successMessage("File PDF berhasil diupload");

      if (onSuccessUpload) onSuccessUpload(results);
    } catch (err) {
      setLastError("Gagal membaca isi folder");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-page flex items-center justify-center">
      <div className="panel motion-rise w-full max-w-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-300/80 bg-zinc-100 text-zinc-700">
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : selectedCount > 0 ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>
        <h2 className="font-tiempos text-2xl text-zinc-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600">
          {description}
        </p>

        <div className="mt-6 space-y-3">
          <div
            className={cn(
              "mx-auto inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium",
              status.className
            )}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="truncate">{status.label}</span>
          </div>

          <input
            id={inputId}
            type="file"
            accept="application/pdf"
            multiple
            //@ts-expect-error
            webkitdirectory="true"
            directory="true"
            className="hidden"
            disabled={isProcessing}
            onChange={(e) => {
              processFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "mx-auto flex w-full max-w-sm cursor-pointer items-center justify-center rounded-md border border-dashed border-zinc-400 bg-zinc-100/70 px-4 py-3 text-sm font-semibold text-zinc-700 transition",
              isProcessing
                ? "pointer-events-none opacity-70"
                : "hover:border-zinc-600 hover:bg-zinc-200"
            )}
          >
            {isProcessing ? "Memproses..." : "Pilih Folder PDF"}
          </label>
          <p className="text-xs text-zinc-500">
            Hanya file PDF, maksimal 300 KB per file.
          </p>
        </div>
      </div>
    </div>
  );
}

