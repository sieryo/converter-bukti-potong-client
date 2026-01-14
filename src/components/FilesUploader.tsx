import React, { useState, useCallback } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
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
}

export default function FilesUploader({
    onFilesSelected,
    title = "Upload PDF Files",
    description = "Drag and drop your PDF files here, or click to browse",
}: FilesUploaderProps) {
    const [internalFiles, setInternalFiles] = useState<FileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFiles = useCallback((fileList: FileList | null) => {
        if (!fileList) return;

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
    }, [onFilesSelected]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = ""; // Reset input
    }, [processFiles]);

    const removeFile = useCallback((id: string) => {
        setInternalFiles((prev) => {
            const updated = prev.filter((f) => f.id !== id);
            onFilesSelected(updated);
            return updated;
        });
    }, [onFilesSelected]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="w-full space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    " p-8 transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center",
                    isDragging
                        ? "border-blue-500 bg-blue-50 scale-[1.01]"
                        : "border-gray-200 hover:border-blue-400 hover:bg-gray-50/50"
                )}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept="application/pdf"
                    onChange={handleFileInput}
                />
                <label htmlFor="file-upload" className="w-full h-full cursor-pointer flex flex-col items-center">
                    <div className={cn(
                        "p-4 rounded-full mb-4 transition-colors",
                        isDragging ? "bg-blue-100" : "bg-gray-100"
                    )}>
                        <Upload className={cn(
                            "w-8 h-8",
                            isDragging ? "text-blue-600" : "text-gray-400"
                        )} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 max-w-sm">{description}</p>
                </label>
            </div>

            {internalFiles.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between text-sm text-gray-500 px-1">
                        <span>{internalFiles.length} file(s) selected</span>
                        <button
                            onClick={() => {
                                setInternalFiles([]);
                                onFilesSelected([]);
                            }}
                            className="text-red-500 hover:text-red-600 text-xs font-medium hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar  p-2">
                        {internalFiles.map((file) => (
                            <div
                                key={file.id}
                                className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-gray-700 truncate block max-w-[200px] md:max-w-[300px]">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
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
