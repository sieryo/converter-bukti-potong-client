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
    <div className="panel col-span-2 flex flex-col overflow-y-auto p-4 motion-rise">
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="panel-soft flex flex-col items-center justify-center p-2.5">
          <span className="text-lg font-bold text-zinc-700">{pendingCount}</span>
          <span className="text-xs text-zinc-600">Pending</span>
        </div>
        <div className="panel-soft flex flex-col items-center justify-center p-2.5">
          <span className="text-lg font-bold text-zinc-700">{validCount}</span>
          <span className="text-xs text-zinc-600">Valid</span>
        </div>
        <div className="panel-soft flex flex-col items-center justify-center p-2.5">
          <span className="text-lg font-bold text-zinc-700">{errorCount}</span>
          <span className="text-xs text-zinc-600">Error</span>
        </div>
      </div>

      <ul className="space-y-2 mb-[200px]">
        {files.map((file) => (
          <PdfFileItem key={file.id} file={file} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
