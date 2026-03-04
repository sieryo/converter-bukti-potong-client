import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileType2,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { BppuCoretax } from "@/types/bppu";
import {
  PdfItemOption,
  type PdfItemOption as PdfItemOptionType,
} from "./PdfItemOption";
import { useHighlightedFile } from "@/store/useHighlightedFile";
import { useValidateStore } from "@/store/useValidateStore";

interface PdfFileItemProps {
  file: BppuCoretax;
  onDelete?: (file: BppuCoretax) => void;
}

export function PdfFileItem({ file, onDelete }: PdfFileItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { highlightedId, setHighlighted } = useHighlightedFile();
  const fileNameWithoutExt = file.name.replace(/\.pdf$/i, "");
  const { processingFiles } = useValidateStore();

  const statusStyles: Record<
    BppuCoretax["status"] | "processing",
    { bg: string; border: string; text: string }
  > = {
    pending: {
      bg: "bg-zinc-50/80",
      border: "border-zinc-300/80",
      text: "text-zinc-700",
    },
    valid: {
      bg: "bg-zinc-100/65",
      border: "border-zinc-400/70",
      text: "text-zinc-800",
    },
    error: {
      bg: "bg-zinc-200/50",
      border: "border-zinc-500/70",
      text: "text-zinc-800",
    },
    processing: {
      bg: "bg-zinc-100/75",
      border: "border-zinc-400/80",
      text: "text-zinc-700",
    },
  };

  const isLoading = processingFiles.includes(file.id);
  const statusToUse = isLoading ? "processing" : file.status;
  const { bg, border, text } = statusStyles[statusToUse];
  const itemRef = useRef<HTMLLIElement>(null);

  const options: PdfItemOptionType[] = [
    {
      label: "Hapus File",
      onClick: () => onDelete?.(file),
      isVisible: true,
      type: "destroy",
    },
  ];

  useEffect(() => {
    if (highlightedId === file.id && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      const timer = setTimeout(() => {
        setHighlighted(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId, file.id, setHighlighted]);

  const highlightClass =
    highlightedId === file.id ? "ring-2 ring-zinc-500 border-zinc-500" : "";

  return (
    <li
      ref={itemRef}
      className={`rounded-lg border shadow-sm transition ${border} ${bg} ${highlightClass}`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full border border-zinc-300/80 bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 shadow-sm">
            <FileType2 className="w-3 h-3" />
            PDF
          </span>

          <span className={`font-medium ${text}`}>{fileNameWithoutExt}</span>
        </div>

        <div className="flex items-center gap-1">
          <PdfItemOption options={options} />

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded-md p-1 transition hover:bg-zinc-200/70"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-8 pb-3 space-y-2">
          {statusToUse === "valid" && file.data?.nomorBukpot && (
            <div className="flex items-center gap-2 rounded-md border border-zinc-400/70 bg-zinc-100 px-2 py-1 text-sm text-zinc-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-zinc-600" />
              <span>Nomor Bukti Potong: {file.data.nomorBukpot}</span>
            </div>
          )}

          {statusToUse === "pending" && (
            <div className="flex items-center gap-2 rounded-md border border-zinc-300/80 bg-zinc-100/70 px-2 py-1 text-sm text-zinc-600">
              <Clock className="w-4 h-4 flex-shrink-0 text-zinc-500" />
              <span>Menunggu validasi..</span>
            </div>
          )}

          {statusToUse === "processing" && (
            <div className="flex items-center gap-2 rounded-md border border-zinc-400/80 bg-zinc-100 px-2 py-1 text-sm text-zinc-700">
              <Clock className="w-4 h-4 flex-shrink-0 text-zinc-600" />
              <span>Memproses...</span>
            </div>
          )}

          {statusToUse === "error" &&
            file.errors?.map((err, idx) => (
              <div
                key={idx}
                className="flex cursor-pointer items-start gap-2 rounded-md border border-zinc-500/70 bg-zinc-200/70 px-2 py-1 text-sm text-zinc-800 hover:bg-zinc-200"
                onClick={() => {
                  if (err.linkToId) {
                    setHighlighted(err.linkToId);
                  }
                }}
              >
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-700" />
                <div className="flex flex-col">
                  <span>{err.message}</span>
                  {err.name && (
                    <span className="text-xs text-zinc-600">
                      File: {err.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </li>
  );
}
