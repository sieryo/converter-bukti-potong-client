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
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pl-1">
                Processing Result
            </h3>

            <div className="grid grid-cols-1 gap-3">
                <div className={cn(
                    "p-4 rounded-xl border flex items-center justify-between transition-all duration-300",
                    "bg-gray-50/50 border-gray-200 text-gray-900"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border border-gray-100 rounded-lg text-gray-700 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg tabular-nums tracking-tight">{processedCount}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Renamed</p>
                        </div>
                    </div>
                </div>

                {skippedCount > 0 && (
                    <div className={cn(
                        "p-4 rounded-xl border flex items-center justify-between transition-all duration-300",
                        "bg-gray-50/50 border-gray-200 text-gray-900"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-100 rounded-lg text-gray-700 shadow-sm">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg tabular-nums tracking-tight">{skippedCount}</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Skipped</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
