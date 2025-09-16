import type { BppuCoretax } from "@/types/bppu";
import { PdfFileItem } from "./PdfFileItem";

interface PdfFileListProps {
  files: BppuCoretax[];
  onDelete?: (file: BppuCoretax) => void;
}

export function PdfFileList({ files, onDelete }: PdfFileListProps) {
  const pendingCount = files.filter((f) => f.status === "pending").length;
  const validCount = files.filter((f) => f.status === "valid").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="col-span-2 border rounded-lg shadow-sm p-4 flex flex-col overflow-y-auto">
      {/* Progress cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-100/60 p-2.5">
          <span className="text-lg font-bold text-gray-700">{pendingCount}</span>
          <span className="text-xs text-gray-700">Pending</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-green-300 bg-green-100/60 p-2.5">
          <span className="text-lg font-bold text-green-700">{validCount}</span>
          <span className="text-xs text-green-700">Valid</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-300 bg-red-100/60 p-2.5">
          <span className="text-lg font-bold text-red-700">{errorCount}</span>
          <span className="text-xs text-red-700">Error</span>
        </div>
      </div>

      <ul className="space-y-2 mb-[200px]">
        {files.map((file) => (
          <PdfFileItem key={file.name} file={file} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
