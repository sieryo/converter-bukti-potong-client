import FilesUploader, { type FileItem } from "@/components/FilesUploader";
import { cn } from "@/lib/utils";

interface FileSectionProps {
    onFilesSelected: (files: FileItem[]) => void;
    hasFiles: boolean;
}

export function FileSection({ onFilesSelected, hasFiles }: FileSectionProps) {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                    Upload Documents
                </h2>
            </div>

            <div className={cn(
                "flex-1 bg-white p-3 rounded-md border transition-all duration-300",
                hasFiles ? "border-blue-200 shadow-sm" : "border-gray-200 shadow-sm"
            )}>
                <FilesUploader
                    onFilesSelected={onFilesSelected}
                    title="Drop PDF files to rename"
                    description="Support multiple files. Only PDF files are accepted."
                />
            </div>
        </div>
    );
}
