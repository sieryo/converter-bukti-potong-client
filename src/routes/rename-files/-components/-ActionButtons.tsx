import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onRename: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  fileCount: number;
}

export function ActionButtons({ onRename, isLoading, isDisabled, fileCount }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 mr-auto">
        {fileCount > 0 && (
          <span className="animate-in fade-in slide-in-from-left-2">
            Ready to process <span className="font-semibold text-gray-900">{fileCount}</span> files
          </span>
        )}
      </div>

      <Button
        size="lg"
        onClick={onRename}
        disabled={isDisabled || isLoading}
        className={cn(
          "relative font-semibold transition-all duration-300 min-w-[160px] h-12 rounded-xl text-base",
          isDisabled
            ? "bg-gray-100 text-gray-400 hover:bg-gray-100"
            : "",
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
            Rename Files
          </>
        )}
      </Button>
    </div>
  );
}
