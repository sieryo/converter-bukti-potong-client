import { cn } from "@/lib/utils";
import { Check, type LucideIcon, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EndpointOption {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    endpoint: string;
}

interface TypeSelectorProps {
    options: EndpointOption[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function TypeSelector({ options, selectedId, onSelect }: TypeSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                    <span className="step-chip">1</span>
                    Jenis Dokumen
                </h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="h-4 w-4 text-zinc-400 transition-colors hover:text-zinc-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Pilih tipe bukti potong yang ingin di-rename</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {options.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedId === item.id;
                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={cn(
                                "group soft-hover relative cursor-pointer overflow-hidden rounded-md border p-4 transition-all duration-300",
                                isSelected
                                    ? "border-zinc-700 bg-zinc-900 text-zinc-50 shadow-md"
                                    : "border-zinc-300/70 bg-zinc-50/80"
                            )}
                        >
                            <div
                                className={cn(
                                    "absolute inset-y-0 left-0 w-1 transition-all",
                                    isSelected ? "bg-zinc-50/85" : "bg-transparent group-hover:bg-zinc-400/70"
                                )}
                            />
                            <div className="flex items-start gap-4 relative z-10">
                                <div
                                    className={cn(
                                        "rounded-lg border p-3 transition-all duration-300 ",
                                        isSelected
                                            ? "border-zinc-100/40 bg-zinc-800 text-zinc-100"
                                            : "border-zinc-300/80 bg-zinc-100/80 text-zinc-600"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3
                                            className={cn(
                                                "font-semibold text-base transition-colors",
                                                isSelected ? "text-zinc-50" : "text-zinc-900"
                                            )}
                                        >
                                            {item.name}
                                        </h3>
                                        {isSelected && (
                                            <span className="animate-in fade-in zoom-in inline-flex items-center rounded border border-zinc-100/20 bg-zinc-100/10 px-2 py-0.5 text-xs font-medium text-zinc-100">
                                                Terpilih
                                            </span>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-sm font-medium font-mono truncate transition-colors",
                                        isSelected ? "text-zinc-300" : "text-zinc-500"
                                    )}>
                                        {item.description}
                                    </p>
                                </div>

                                <div className={cn(
                                    "absolute top-4 right-4 transition-all duration-300 transform",
                                    isSelected
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 translate-x-4"
                                )}>
                                    <div className="rounded-full bg-zinc-100 p-1 text-zinc-900 shadow-sm">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

