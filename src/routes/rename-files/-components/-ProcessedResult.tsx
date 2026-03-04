import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessedResultProps {
    processedCount: number;
    skippedCount: number;
}

export function ProcessedResult({ processedCount, skippedCount }: ProcessedResultProps) {
    if (processedCount === 0 && skippedCount === 0) return null;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="pl-1 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Processing Result
            </h3>

            <div className="grid grid-cols-1 gap-3">
                <div className={cn(
                    "flex items-center justify-between rounded-md border p-4 transition-all duration-300",
                    "border-zinc-300/70 bg-zinc-50/70 text-zinc-900"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-2 text-zinc-700 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg tabular-nums tracking-tight">{processedCount}</p>
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Renamed</p>
                        </div>
                    </div>
                </div>

                {skippedCount > 0 && (
                    <div className={cn(
                        "flex items-center justify-between rounded-md border p-4 transition-all duration-300",
                        "border-zinc-300/70 bg-zinc-50/70 text-zinc-900"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-2 text-zinc-700 shadow-sm">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg tabular-nums tracking-tight">{skippedCount}</p>
                                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Skipped</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

