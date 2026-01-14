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
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                    Select Format
                </h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Pilih format bukti potong</p>
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
                                "group relative p-4 rounded-md border transition-all duration-300 cursor-pointer overflow-hidden",
                                isSelected
                                    ? "border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20"
                                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:bg-gray-50/50"
                            )}
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div
                                    className={cn(
                                        "p-3 rounded-lg transition-all border duration-300 ",
                                        isSelected
                                            ? "bg-blue-500 text-white shadow-blue-200"
                                            : "bg-white text-gray-500 border border-gray-100 group-hover:text-blue-500 group-hover:border-blue-100"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3
                                            className={cn(
                                                "font-semibold text-base transition-colors",
                                                isSelected ? "text-blue-900" : "text-gray-900"
                                            )}
                                        >
                                            {item.name}
                                        </h3>
                                        {isSelected && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 animate-in fade-in zoom-in">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-sm font-medium font-mono truncate transition-colors",
                                        isSelected ? "text-blue-600/80" : "text-gray-500"
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
                                    <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg shadow-blue-500/30">
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
