import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Download } from "lucide-react";

interface ActionButtonsProps {
  onRename: () => void;
  onDownload?: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  canDownload?: boolean;
  renameLabel?: string;
}

export function ActionButtons({
  onRename,
  onDownload,
  isLoading,
  isDisabled,
  canDownload,
  renameLabel = "Rename Files",
}: ActionButtonsProps) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-300/70 pt-4">

      {canDownload && onDownload && (
        <Button
          size="lg"
          variant="outline"
          onClick={onDownload}
          className="h-12 rounded-md border-zinc-400 text-base font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Result
        </Button>
      )}

      <Button
        size="lg"
        onClick={onRename}
        disabled={isDisabled || isLoading}
        className={cn(
          "relative font-semibold transition-all duration-300 min-w-[160px] h-12 rounded-md text-base",
          isDisabled
            ? "bg-zinc-200 text-zinc-500 hover:bg-zinc-200"
            : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
          isLoading && "cursor-wait"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {renameLabel}
          </>
        )}
      </Button>
    </div>
  );
}

