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
      bg: "bg-gray-50",
      border: "border-gray-300",
      text: "text-gray-700",
    },
    valid: {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-700",
    },
    error: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" },
    processing: {
      bg: "bg-orange-50",
      border: "border-orange-300",
      text: "text-orange-700",
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
    highlightedId === file.id ? "ring-2 ring-rose-400 border-rose-400" : "";

  return (
    <li
      ref={itemRef}
      className={`rounded-lg shadow-sm transition border ${border} ${bg} ${highlightClass}`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-rose-500/70 text-white rounded-full shadow-sm">
            <FileType2 className="w-3 h-3" />
            PDF
          </span>

          <span className={`font-medium ${text}`}>{fileNameWithoutExt}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Option menu */}
          <PdfItemOption options={options} />

          {/* Chevron toggle */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md hover:bg-gray-100 transition"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-8 pb-3 space-y-2">
          {statusToUse === "valid" && file.data?.nomorBukpot && (
            <div className="flex items-center gap-2 text-sm bg-green-100 border border-green-200 rounded-md px-2 py-1 text-green-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Nomor Bukti Potong: {file.data.nomorBukpot}</span>
            </div>
          )}

          {statusToUse === "pending" && (
            <div className="flex items-center gap-2 text-sm bg-gray-100 border border-gray-200 rounded-md px-2 py-1 text-gray-600">
              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>Menunggu validasi..</span>
            </div>
          )}

          {statusToUse === "processing" && (
            <div className="flex items-center gap-2 text-sm bg-orange-100 border border-orange-200 rounded-md px-2 py-1 text-orange-700">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>Memproses validasi...</span>
            </div>
          )}

          {statusToUse === "error" &&
            file.errors?.map((err, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm bg-red-100 border border-red-200 rounded-md px-2 py-1 text-red-700 cursor-pointer hover:bg-red-200/70"
                onClick={() => {
                  if (err.linkToId) {
                    setHighlighted(err.linkToId);
                  }
                }}
              >
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>{err.message}</span>
                  {err.name && (
                    <span className="text-xs text-gray-600">
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
