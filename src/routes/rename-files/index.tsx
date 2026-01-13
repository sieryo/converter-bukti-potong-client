import { createFileRoute, Link } from "@tanstack/react-router";
import FilesUploader, { type FileItem } from "@/components/FilesUploader";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, FileType, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleErrorResponse, renameFiles } from "@/utils/api";
import { toast } from "sonner";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { FullscreenLoader } from "@/components/FullScreenLoader";

export const Route = createFileRoute("/rename-files/")({
    component: RouteComponent,
});

const ENDPOINTS = [
    {
        id: "bppu",
        name: "Bukti Potong BPPU",
        description: "[nama] - [nomor dokumen] - [masa pajak]",
        icon: FileType,
        endpoint: "rename_bppu",
    },
    {
        id: "rename_v2",
        name: "Bukti Potong BP21",
        description: "[nama] - [nomor dokumen] - [masa pajak]",
        icon: Type,
        endpoint: "/api/rename_bp21",
    },
];

function RouteComponent() {
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const { setIsLoading } = useFullScreenLoadingStore();

    const handleRename = async () => {
        if (!selectedEndpoint) {
            toast.error("Please select a renaming format first.");
            return;
        }
        if (files.length === 0) {
            toast.error("Please upload at least one PDF file.");
            return;
        }

        const endpointConfig = ENDPOINTS.find((e) => e.id === selectedEndpoint);
        if (!endpointConfig) return;

        try {
            setIsLoading(true);
            const rawFiles = files.map((f) => f.file);
            await renameFiles(endpointConfig.endpoint, rawFiles);
            toast.success("Files renamed successfully!");
        } catch (error) {
            handleErrorResponse(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <FullscreenLoader />
            <div className="max-w-5xl mx-auto space-y-8 bg-white p-3 border rounded-md">
                <div className="flex items-start gap-3">
                    <Link
                        to="/home"
                        className="mt-1 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="w-8 h-8" />
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Batch Rename Files
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Pilih Tipe Bukti Potong dan upload filenya
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        1. Pilih Tipe
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ENDPOINTS.map((item) => {
                            const Icon = item.icon;
                            const isSelected = selectedEndpoint === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedEndpoint(item.id)}
                                    className={cn(
                                        "relative p-6 rounded-xl border-1 cursor-pointer transition-all duration-200 group bg-white",
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/30 shadow-md ring-1 ring-blue-500"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={cn(
                                                "p-3 rounded-lg transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 text-blue-500"
                                                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                            )}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3
                                                className={cn(
                                                    "font-semibold text-lg transition-colors",
                                                    isSelected ? "text-blue-900" : "text-gray-900"
                                                )}
                                            >
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        2. Upload Files
                    </h2>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <FilesUploader
                            onFilesSelected={setFiles}
                            title="Drop PDF files to rename"
                            description="Support multiple files. Only PDF files are accepted."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end pt-4">
                    <Button
                        size="lg"
                        onClick={handleRename}
                        disabled={!selectedEndpoint || files.length === 0}
                        className={cn(
                            "font-semibold transition-all duration-300",
                            !selectedEndpoint || files.length === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        )}
                    >
                        Rename {files.length > 0 ? `${files.length} Files` : "Files"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
