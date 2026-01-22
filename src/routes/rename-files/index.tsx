import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { handleErrorResponse, renameFiles, getRenameProgress, downloadRenameResult } from "@/utils/api";
import { toast } from "sonner";
import { FullscreenLoader } from "@/components/FullScreenLoader";
import { errorMessage } from "@/utils/message";
import { type FileItem } from "@/components/FilesUploader";
import { FileText } from "lucide-react";
import { Header } from "./-components/-Header";
import { TypeSelector, type EndpointOption } from "./-components/-TypeSelector";
import { FileSection } from "./-components/-FileSection";
import { ActionButtons } from "./-components/-ActionButtons";
import { ProgressStats } from "./-components/-ProgressStats";
import type { RenameJobStatus } from "@/types/job";

export const Route = createFileRoute("/rename-files/")({
    component: RouteComponent,
});

const ENDPOINTS: EndpointOption[] = [
    {
        id: "bppu",
        name: "Bukti Potong BPPU",
        description: "[nomor dokumen] - [nama] - [masa pajak].pdf",
        icon: FileText,
        endpoint: "rename_bppu",
    },
    {
        id: "bp21",
        name: "Bukti Potong BP21",
        description: "[nomor dokumen] - [nama] - [masa pajak].pdf",
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
    const [localLoading, setLocalLoading] = useState(false);

    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<RenameJobStatus | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (jobId && jobStatus?.status !== 'done' && jobStatus?.status !== 'error') {
            intervalId = setInterval(async () => {
                try {
                    const status = await getRenameProgress(jobId);
                    setJobStatus(status);

                    if (status.status === 'done') {
                        setLocalLoading(false);
                        toast.success("Files renamed successfully!");
                    } else if (status.status === 'error') {
                        setLocalLoading(false);
                        toast.error(status.error || "Processing failed");
                    }
                } catch (error) {
                    console.error("Failed to poll status", error);
                }
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [jobId, jobStatus?.status]);

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
            setLocalLoading(true);
            setJobStatus(null);
            setJobId(null);

            const rawFiles = files.map((f) => f.file);
            const response = await renameFiles(endpointConfig.endpoint, rawFiles);

            if (response.job_id) {
                setJobId(response.job_id);
                // Initialize status
                setJobStatus({
                    job_id: response.job_id,
                    status: "queued",
                    total_files: rawFiles.length,
                    processed_files: 0,
                    skipped_files: 0
                });
            } else {
                toast.error("No Job ID received");
                throw new Error("No Job ID received");
            }

        } catch (error) {
            setLocalLoading(false);
            const err = await handleErrorResponse(error)
            errorMessage(err.error || "Failed to initiate rename")
            console.log(err)
        }
    };

    const handleDownload = () => {
        if (jobId) {
            downloadRenameResult(jobId);
            setJobId(null);
            setJobStatus(null);
            toast.success("Download started and state reset");
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

                        {jobId && (
                            <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm mb-4">
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Job ID</p>
                                <p className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-100 select-all">
                                    {jobId}
                                </p>
                            </div>
                        )}

                        {jobStatus && (
                            <ProgressStats status={jobStatus} />
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
                                onDownload={handleDownload}
                                isLoading={localLoading}
                                isDisabled={!selectedEndpoint || files.length === 0}
                                canDownload={jobStatus?.status === 'done'}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
