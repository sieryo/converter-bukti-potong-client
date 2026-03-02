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
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">1</span>
                    Jenis Dokumen
                </h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
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
                                "group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
                                isSelected
                                    ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-cyan-50 shadow-md ring-1 ring-emerald-500/30"
                                    : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50/30"
                            )}
                        >
                            <div
                                className={cn(
                                    "absolute inset-y-0 left-0 w-1 transition-all",
                                    isSelected ? "bg-emerald-500" : "bg-transparent group-hover:bg-emerald-300"
                                )}
                            />
                            <div className="flex items-start gap-4 relative z-10">
                                <div
                                    className={cn(
                                        "p-3 rounded-lg transition-all border duration-300 ",
                                        isSelected
                                            ? "bg-emerald-600 text-white shadow-emerald-200"
                                            : "bg-white text-gray-500 border border-gray-100 group-hover:text-emerald-600 group-hover:border-emerald-100"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3
                                            className={cn(
                                                "font-semibold text-base transition-colors",
                                                isSelected ? "text-emerald-900" : "text-gray-900"
                                            )}
                                        >
                                            {item.name}
                                        </h3>
                                        {isSelected && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 animate-in fade-in zoom-in">
                                                Terpilih
                                            </span>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-sm font-medium font-mono truncate transition-colors",
                                        isSelected ? "text-emerald-700/90" : "text-gray-500"
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
                                    <div className="bg-emerald-600 text-white p-1 rounded-full shadow-lg shadow-emerald-500/30">
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
