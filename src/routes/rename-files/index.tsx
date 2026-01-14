import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { handleErrorResponse, renameFiles } from "@/utils/api";
import { toast } from "sonner";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { FullscreenLoader } from "@/components/FullScreenLoader";
import { errorMessage } from "@/utils/message";
import { type FileItem } from "@/components/FilesUploader";
import { FileText } from "lucide-react";
import { Header } from "./-components/-Header";
import { TypeSelector, type EndpointOption } from "./-components/-TypeSelector";
import { FileSection } from "./-components/-FileSection";
import { ActionButtons } from "./-components/-ActionButtons";
import { ProcessedResult } from "./-components/-ProcessedResult";

export const Route = createFileRoute("/rename-files/")({
    component: RouteComponent,
});

const ENDPOINTS: EndpointOption[] = [
    {
        id: "bppu",
        name: "Bukti Potong BPPU",
        description: "[nama] - [nomor dokumen] - [masa pajak].pdf",
        icon: FileText,
        endpoint: "rename_bppu",
    },
    {
        id: "bp21",
        name: "Bukti Potong BP21",
        description: "[nama] - [nomor dokumen] - [masa pajak].pdf",
        icon: FileText,
        endpoint: "rename_bp21",
    },
    {
        id: "bpa1",
        name: "Bukti Potong BPA1",
        description: "BPA1 - [nama] - [posisi].pdf",
        icon: FileText,
        endpoint: "rename_bpa1",
    },
];

function RouteComponent() {
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const { setIsLoading } = useFullScreenLoadingStore();
    const [localLoading, setLocalLoading] = useState(false);
    const [resultStats, setResultStats] = useState<{ processed: number; skipped: number } | null>(null);

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
            setLocalLoading(true);
            setResultStats(null);

            const rawFiles = files.map((f) => f.file);
            const response = await renameFiles(endpointConfig.endpoint, rawFiles);

            const headers = response.headers as any;
            const processedCount = headers.get ? Number(headers.get("X-Processed-Files")) : Number(headers["x-processed-files"] || 0);
            const skippedCount = headers.get ? Number(headers.get("X-Skipped-Files")) : Number(headers["x-skipped-files"] || 0);

            if (!isNaN(processedCount) || !isNaN(skippedCount)) {
                setResultStats({
                    processed: isNaN(processedCount) ? 0 : processedCount,
                    skipped: isNaN(skippedCount) ? 0 : skippedCount
                });
            }

            toast.success("Files renamed successfully!");
        } catch (error) {
            const err = await handleErrorResponse(error)
            errorMessage(err.error || "Failed to rename files")
            console.log(err)
        } finally {
            setIsLoading(false);
            setLocalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <FullscreenLoader />
            <div className="max-w-6xl mx-auto space-y-6">

                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200/60 shadow-sm">
                            <TypeSelector
                                options={ENDPOINTS}
                                selectedId={selectedEndpoint}
                                onSelect={setSelectedEndpoint}
                            />
                        </div>

                        {resultStats && (
                            <ProcessedResult
                                processedCount={resultStats.processed}
                                skippedCount={resultStats.skipped}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200/60 shadow-sm h-full flex flex-col">
                            <FileSection
                                onFilesSelected={setFiles}
                                hasFiles={files.length > 0}
                            />

                            <ActionButtons
                                onRename={handleRename}
                                isLoading={localLoading}
                                isDisabled={!selectedEndpoint || files.length === 0}
                                fileCount={files.length}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
