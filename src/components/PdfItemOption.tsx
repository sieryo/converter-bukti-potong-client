import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { DropdownItemDelete } from "./DropdownItemDelete";
import { useApiLoadingStore } from "@/store/useApiLoading";

export type PdfItemOption = {
  label: string;
  onClick: (e?: any) => void;
  isVisible: boolean;
  type: "default" | "destroy";
};

export const PdfItemOption = ({
  options,
}: {
  isActive?: boolean;
  options: PdfItemOption[];
}) => {
  const {isLoading} = useApiLoadingStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "p-1 text-gray-800 disabled:text-gray-400 group-hover:opacity-100 transition-opacity"
          )}
          disabled={isLoading}
        >
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-gray-900 shadow-md">
        {options.map((opt) => {
          if (!opt.isVisible) return null;

          if (opt.type == "default") {
            return (
              <DropdownMenuItem key={opt.label} onClick={opt.onClick}>
                {opt.label}
              </DropdownMenuItem>
            );
          } else if (opt.type == "destroy") {
            return (
              <DropdownItemDelete
                key={opt.label}
                onClick={opt.onClick}
                label={opt.label}
              />
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
