import React, { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { generateUUID } from "@/utils/uuid";
import { cn } from "@/lib/utils";

export interface FileItem {
    id: string;
    file: File;
    name: string;
    size: number;
}

interface FilesUploaderProps {
    onFilesSelected: (files: FileItem[]) => void;
    title?: string;
    description?: string;
    isBusy?: boolean;
}

export default function FilesUploader({
    onFilesSelected,
    title = "Upload PDF Files",
    description = "Drag and drop your PDF files here, or click to browse",
    isBusy = false,
}: FilesUploaderProps) {
    const [internalFiles, setInternalFiles] = useState<FileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingSelection, setIsProcessingSelection] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        if (isBusy) return;
        e.preventDefault();
        setIsDragging(true);
    }, [isBusy]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFiles = useCallback((fileList: FileList | null) => {
        if (isBusy) return;
        if (!fileList) return;
        setIsProcessingSelection(true);

        const newFiles: FileItem[] = [];
        const skippedFiles: string[] = [];

        Array.from(fileList).forEach((file) => {
            if (file.type === "application/pdf") {
                newFiles.push({
                    id: generateUUID(),
                    file,
                    name: file.name,
                    size: file.size,
                });
            } else {
                skippedFiles.push(file.name);
            }
        });

        if (skippedFiles.length > 0) {
            toast.warning(`Skipped ${skippedFiles.length} non-PDF file(s)`);
        }

        if (newFiles.length > 0) {
            setInternalFiles((prev) => {
                const updated = [...prev, ...newFiles];
                onFilesSelected(updated);
                return updated;
            });
            toast.success(`Added ${newFiles.length} PDF file(s)`);
        }
        setIsProcessingSelection(false);
    }, [onFilesSelected, isBusy]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        if (isBusy) return;
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles, isBusy]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = ""; // Reset input
    }, [processFiles]);

    const removeFile = useCallback((id: string) => {
        if (isBusy) return;
        setInternalFiles((prev) => {
            const updated = prev.filter((f) => f.id !== id);
            onFilesSelected(updated);
            return updated;
        });
    }, [onFilesSelected, isBusy]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const totalSize = internalFiles.reduce((acc, file) => acc + file.size, 0);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between rounded-md border border-zinc-300/70 bg-zinc-100/60 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-700">
                    {isBusy || isProcessingSelection ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : internalFiles.length > 0 ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                        <Upload className="h-3.5 w-3.5" />
                    )}
                    <span className="font-medium">
                        {isBusy
                            ? "Job sedang berjalan"
                            : isProcessingSelection
                            ? "Membaca file..."
                            : internalFiles.length > 0
                            ? "Siap diproses"
                            : "Menunggu file"}
                    </span>
                </div>
                <span className="text-zinc-600">
                    {internalFiles.length} file • {formatSize(totalSize)}
                </span>
            </div>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-all duration-200 ease-in-out",
                    (isBusy || isProcessingSelection) && "pointer-events-none opacity-75",
                    isDragging
                        ? "scale-[1.01] border-zinc-500 bg-zinc-200/70"
                        : "border-zinc-300/80 bg-zinc-50/40 hover:border-zinc-500 hover:bg-zinc-100/70"
                )}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept="application/pdf"
                    disabled={isBusy || isProcessingSelection}
                    onChange={handleFileInput}
                />
                <label htmlFor="file-upload" className="w-full h-full cursor-pointer flex flex-col items-center">
                    <div className={cn(
                        "p-4 rounded-full mb-4 transition-colors",
                        isDragging ? "bg-zinc-300/80" : "bg-zinc-200/70"
                    )}>
                        {isBusy || isProcessingSelection ? (
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
                        ) : (
                            <Upload className={cn(
                                "w-8 h-8",
                                isDragging ? "text-zinc-700" : "text-zinc-500"
                            )} />
                        )}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-zinc-900">{title}</h3>
                    <p className="max-w-sm text-sm text-zinc-500">{description}</p>
                </label>
            </div>

            {internalFiles.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between px-1 text-sm text-zinc-500">
                        <span>{internalFiles.length} file(s) selected</span>
                        <button
                            onClick={() => {
                                if (isBusy) return;
                                setInternalFiles([]);
                                onFilesSelected([]);
                            }}
                            className={cn(
                                "text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:underline",
                                isBusy && "pointer-events-none opacity-50"
                            )}
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar  p-2">
                        {internalFiles.map((file) => (
                            <div
                                key={file.id}
                                className="group flex items-center justify-between rounded-lg border border-zinc-300/70 bg-zinc-50/80 p-3 shadow-sm transition-all duration-200 hover:border-zinc-400"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-2">
                                        <FileText className="h-5 w-5 text-zinc-700" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="block max-w-[200px] truncate text-sm font-medium text-zinc-700 md:max-w-[300px]">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-zinc-500">{formatSize(file.size)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className={cn(
                                        "rounded-full p-1.5 text-zinc-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-zinc-200 hover:text-zinc-700",
                                        isBusy && "pointer-events-none opacity-50"
                                    )}
                                    title="Remove file"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

