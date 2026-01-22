import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { RenameJobStatus } from "@/types/job";

interface ProgressStatsProps {
    status: RenameJobStatus | null;
}

export function ProgressStats({ status }: ProgressStatsProps) {
    if (!status) return null;

    const isProcessing = status.status === "processing" || status.status === "queued";
    const isDone = status.status === "done";
    const isError = status.status === "error";

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">Processing Status</h3>
                <div className="flex items-center gap-2">
                    {isProcessing && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            {status.status === "queued" ? "Queued" : "Processing"}
                        </span>
                    )}
                    {isDone && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                        </span>
                    )}
                    {isError && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Error
                        </span>
                    )}
                </div>
            </div>

            {status.error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                    {status.error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-md border border-gray-100 text-center">
                    <div className="text-sm text-gray-500 mb-1">Total Files</div>
                    <div className="text-2xl font-semibold text-gray-900">{status.total_files}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-md border border-green-100 text-center">
                    <div className="text-sm text-green-600 mb-1">Processed</div>
                    <div className="text-2xl font-semibold text-green-700">{status.processed_files}</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-100 text-center">
                    <div className="text-sm text-yellow-600 mb-1">Skipped</div>
                    <div className="text-2xl font-semibold text-yellow-700">{status.skipped_files}</div>
                </div>
            </div>

            {status.total_files > 0 && (
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold inline-block text-blue-600">
                            Progress
                        </div>
                        <div className="text-xs font-semibold inline-block text-blue-600">
                            {Math.round(((status.processed_files + status.skipped_files) / status.total_files) * 100)}%
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                        <div
                            style={{ width: `${((status.processed_files + status.skipped_files) / status.total_files) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
