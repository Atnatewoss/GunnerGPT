'use client';

import {
    Library,
    Users,
    Trophy,
    Settings2,
    Filter,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const categories = [
    { id: 'all', label: 'General Intelligence', icon: Library },
    { id: 'players', label: 'Player Analytics', icon: Users },
    { id: 'tactics', label: 'Tactical Patterns', icon: Settings2 },
    { id: 'seasons', label: 'Seasonal Archives', icon: Trophy },
];

interface KnowledgeSidebarProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export function KnowledgeSidebar({ activeCategory, onCategoryChange }: KnowledgeSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-card/10 border-r">
            <div className="p-4 border-b bg-card/30">
                <div className="flex items-center space-x-2 text-red-600 mb-4">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Research Filters</span>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            Timeframe
                        </label>
                        <Select defaultValue="2025-26">
                            <SelectTrigger className="h-9 text-xs bg-background">
                                <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025-26">Season 2025/26</SelectItem>
                                <SelectItem value="2024-25">Season 2024/25</SelectItem>
                                <SelectItem value="2023-24">Season 2023/24</SelectItem>
                                <SelectItem value="2022-23">Season 2022/23</SelectItem>
                                <SelectItem value="2021-22">Season 2021/22</SelectItem>
                                <SelectItem value="2020-21">Season 2020/21</SelectItem>
                                <SelectItem value="2019-20">Season 2019/20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    <div className="px-3 py-2">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Categories
                        </h2>
                    </div>
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group",
                                    isActive
                                        ? "bg-red-600 text-white shadow-md shadow-red-200"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-red-600")} />
                                    <span>{cat.label}</span>
                                </div>
                                {isActive && <Check className="w-3.5 h-3.5" />}
                            </button>
                        );
                    })}
                </div>

                <Separator className="my-2 mx-4" />

                <div className="p-4 space-y-4">
                    <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-1">
                            Search parameters
                        </h3>
                        <p className="text-[10px] text-red-600 leading-normal">
                            Neural weights adjusted for semantic precision. Cross-referencing 12,402 nodes.
                        </p>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card/30 mt-auto">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    <span>Retrieval Mode</span>
                    <span className="text-green-600 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                        Active
                    </span>
                </div>
            </div>
        </div>
    );
}
