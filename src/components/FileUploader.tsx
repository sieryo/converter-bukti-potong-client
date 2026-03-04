import { useId, useMemo, useState } from "react";
import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileUploader({
  title,
  description,
  onUpload,
  isLoading = false,
}: {
  title: string;
  description: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputId = useId();

  const status = useMemo(() => {
    if (isLoading) {
      return {
        label: "Memproses file...",
        className: "border-zinc-400 bg-zinc-200/80 text-zinc-700",
      };
    }
    if (selectedFile) {
      return {
        label: `Terpilih: ${selectedFile.name}`,
        className: "border-zinc-500 bg-zinc-900 text-zinc-50",
      };
    }
    return {
      label: "Belum ada file dipilih",
      className: "border-zinc-300 bg-zinc-100 text-zinc-600",
    };
  }, [isLoading, selectedFile]);

  return (
    <div className="app-page flex items-center justify-center">
      <div className="panel motion-rise w-full max-w-xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-300/80 bg-zinc-100 text-zinc-700">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : selectedFile ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>
        <h2 className="font-tiempos text-2xl text-zinc-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
          {description}
        </p>

        <div className="mt-6 space-y-3">
          <div
            className={cn(
              "mx-auto inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium",
              status.className
            )}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="truncate">{status.label}</span>
          </div>

          <input
            id={inputId}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            disabled={isLoading}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedFile(file);
              onUpload(e);
            }}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "mx-auto flex w-full max-w-sm cursor-pointer items-center justify-center rounded-md border border-dashed border-zinc-400 bg-zinc-100/70 px-4 py-3 text-sm font-semibold text-zinc-700 transition",
              isLoading
                ? "pointer-events-none opacity-70"
                : "hover:border-zinc-600 hover:bg-zinc-200"
            )}
          >
            {isLoading ? "Menunggu proses..." : "Pilih File Excel"}
          </label>
          <p className="text-xs text-zinc-500">Format yang didukung: `.xlsx`, `.xls`</p>
        </div>
      </div>
    </div>
  );
}

