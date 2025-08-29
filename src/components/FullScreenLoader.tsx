import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { LoaderCircle } from "lucide-react";

export const FullscreenLoader = () => {
  const { isLoading } = useFullScreenLoadingStore();

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-70 z-[9000]">
      <div className=" w-full h-full bg-gray-900/40 absolute"></div>
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="h-12 w-12 animate-spin text-gray-200" />
      </div>
    </div>
  );
};
