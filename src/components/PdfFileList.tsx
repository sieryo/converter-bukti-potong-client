import { PdfFileItem, type PdfFile } from "./PdfFileItem";

interface PdfFileListProps {
  files: PdfFile[];
}

export function PdfFileList({ files }: PdfFileListProps) {
  return (
    <div className="col-span-2 border rounded-lg shadow-sm p-4 overflow-y-auto">
      <h2 className="text-lg mb-3">Daftar File PDF</h2>
      <ul className="space-y-2">
        {files.map((file) => (
          <PdfFileItem key={file.name} file={file} />
        ))}
      </ul>
    </div>
  );
}
