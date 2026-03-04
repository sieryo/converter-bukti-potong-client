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
    const completed = status.processed_files + status.skipped_files;
    const progress = status.total_files > 0
        ? Math.min(100, Math.round((completed / status.total_files) * 100))
        : 0;

    return (
        <div className="panel space-y-4 p-6 motion-rise">
            <div className="flex items-center justify-between border-b border-zinc-300/70 pb-4">
                <h3 className="text-lg font-medium text-zinc-900">Processing Status</h3>
                <div className="flex items-center gap-2">
                    {isProcessing && (
                        <span className="inline-flex items-center rounded-full border border-zinc-400/70 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            {status.status === "queued" ? "Queued" : "Processing"}
                        </span>
                    )}
                    {isDone && (
                        <span className="inline-flex items-center rounded-full border border-zinc-500 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                        </span>
                    )}
                    {isError && (
                        <span className="inline-flex items-center rounded-full border border-zinc-500 bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Error
                        </span>
                    )}
                </div>
            </div>

            {status.error && (
                <div className="rounded-md border border-zinc-400 bg-zinc-200/70 p-4 text-sm text-zinc-700">
                    {status.error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md border border-zinc-300/70 bg-zinc-100/70 p-4 text-center">
                    <div className="mb-1 text-sm text-zinc-500">Total Files</div>
                    <div className="text-2xl font-semibold text-zinc-900">{status.total_files}</div>
                </div>
                <div className="rounded-md border border-zinc-300/70 bg-zinc-100/70 p-4 text-center">
                    <div className="mb-1 text-sm text-zinc-500">Processed</div>
                    <div className="text-2xl font-semibold text-zinc-900">{status.processed_files}</div>
                </div>
                <div className="rounded-md border border-zinc-300/70 bg-zinc-100/70 p-4 text-center">
                    <div className="mb-1 text-sm text-zinc-500">Skipped</div>
                    <div className="text-2xl font-semibold text-zinc-900">{status.skipped_files}</div>
                </div>
            </div>

            {status.total_files > 0 && (
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div className="inline-block text-xs font-semibold text-zinc-600">
                            Progress
                        </div>
                        <div className="inline-block text-xs font-semibold text-zinc-600">
                            {progress}%
                        </div>
                    </div>
                    <div className="mb-4 flex h-2 overflow-hidden rounded bg-zinc-300/70 text-xs">
                        <div
                            style={{ width: `${progress}%` }}
                            className="flex flex-col justify-center whitespace-nowrap bg-zinc-800 text-center text-white shadow-none transition-all duration-500"
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
