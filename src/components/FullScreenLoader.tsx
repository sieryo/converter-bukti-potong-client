import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { LoaderCircle } from "lucide-react";

export const FullscreenLoader = () => {
  const { isLoading } = useFullScreenLoadingStore();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[2px]" />
      <div className="panel relative flex min-w-[180px] flex-col items-center gap-3 p-6">
        <LoaderCircle className="h-10 w-10 animate-spin text-zinc-700" />
        <p className="text-sm font-medium text-zinc-600">Memproses data...</p>
      </div>
    </div>
  );
};
