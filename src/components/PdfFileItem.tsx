import { useState } from "react";
import { ChevronDown, ChevronRight, FileType2, XCircle } from "lucide-react";

export interface PdfFile {
  name: string;
  status: "pending" | "valid" | "error";
  errors?: string[];
}

interface PdfFileItemProps {
  file: PdfFile;
}

export function PdfFileItem({ file }: PdfFileItemProps) {
  const [expanded, setExpanded] = useState(false);
  const fileNameWithoutExt = file.name.replace(/\.pdf$/i, "");

  const statusStyles: Record<
    PdfFile["status"],
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
    error: {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-700",
    },
  };

  const { bg, border, text } = statusStyles[file.status];

  return (
    <li
      className={`rounded-lg shadow-sm transition cursor-pointer border ${border} ${bg}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-rose-500/70 text-white rounded-full shadow-sm">
            <FileType2 className="w-3 h-3" />
            PDF
          </span>

          <span className={`font-medium ${text}`}>{fileNameWithoutExt}</span>
        </div>

        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {expanded && file.errors && (
        <ul className="px-8 pb-3 space-y-2">
          {file.errors.map((err, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-sm bg-red-100 border border-red-200 rounded-md px-2 py-1 text-red-700"
            >
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{err}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
