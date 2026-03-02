import FilesUploader, { type FileItem } from "@/components/FilesUploader";
import { cn } from "@/lib/utils";

interface FileSectionProps {
    onFilesSelected: (files: FileItem[]) => void;
    hasFiles: boolean;
    stepNumber?: number;
    title?: string;
    description?: string;
}

export function FileSection({
    onFilesSelected,
    hasFiles,
    stepNumber = 2,
    title = "Drop PDF files to rename",
    description = "Support multiple files. Only PDF files are accepted.",
}: FileSectionProps) {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        {stepNumber}
                    </span>
                    Upload Dokumen
                </h2>
            </div>

            <div className={cn(
                "flex-1 bg-white p-3 rounded-xl border transition-all duration-300",
                hasFiles ? "border-emerald-200 shadow-sm" : "border-gray-200 shadow-sm"
            )}>
                <FilesUploader
                    onFilesSelected={onFilesSelected}
                    title={title}
                    description={description}
                />
            </div>
        </div>
    );
}
