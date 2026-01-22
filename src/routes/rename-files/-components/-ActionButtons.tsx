import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Download } from "lucide-react";

interface ActionButtonsProps {
  onRename: () => void;
  onDownload?: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  canDownload?: boolean;
}

export function ActionButtons({ onRename, onDownload, isLoading, isDisabled, canDownload }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-6 gap-3">


      {canDownload && onDownload && (
        <Button
          size="lg"
          variant="outline"
          onClick={onDownload}
          className="font-semibold h-12 rounded-xl text-base border-primary text-primary hover:bg-primary/5"
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
