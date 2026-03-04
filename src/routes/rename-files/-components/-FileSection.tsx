import FilesUploader, { type FileItem } from "@/components/FilesUploader";
import { cn } from "@/lib/utils";

interface FileSectionProps {
    onFilesSelected: (files: FileItem[]) => void;
    hasFiles: boolean;
    stepNumber?: number;
    title?: string;
    description?: string;
    isBusy?: boolean;
}

export function FileSection({
    onFilesSelected,
    hasFiles,
    stepNumber = 2,
    title = "Drop PDF files to rename",
    description = "Support multiple files. Only PDF files are accepted.",
    isBusy = false,
}: FileSectionProps) {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                    <span className="step-chip">{stepNumber}</span>
                    Upload Dokumen
                </h2>
            </div>

            <div className={cn(
                "flex-1 rounded-md border p-3 transition-all duration-300",
                hasFiles ? "border-zinc-500/70 bg-zinc-100/60 shadow-sm" : "border-zinc-300/70 bg-zinc-50/70 shadow-sm"
            )}>
                <FilesUploader
                    onFilesSelected={onFilesSelected}
                    title={title}
                    description={description}
                    isBusy={isBusy}
                />
            </div>
        </div>
    );
}

