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
            "p-1 text-zinc-700 transition-opacity group-hover:opacity-100 disabled:text-zinc-400"
          )}
          disabled={isLoading}
        >
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-zinc-300 bg-zinc-50 text-zinc-900 shadow-md">
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
