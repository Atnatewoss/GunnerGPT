'use client';

import {
    Library,
    Users,
    Trophy,
    Settings2,
    Filter,
    Check,
    User,
    Heart,
    ChevronDown,
    ChevronRight,
    X
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
import { useState } from "react";
import { Button } from "@/components/ui/button";

const categories = [
    { id: 'all', label: 'General Intelligence', icon: Library },
    { id: 'tactics', label: 'Tactical Patterns', icon: Settings2 },
    { id: 'arteta', label: 'Arteta Era', icon: User },
    { id: 'fans', label: 'Fan Intelligence', icon: Heart },
];

const players = [
    { id: 'david-raya', name: 'David Raya' },
    { id: 'william-saliba', name: 'William Saliba' },
    { id: 'gabriel-magalhaes', name: 'Gabriel Magalhães' },
    { id: 'ben-white', name: 'Ben White' },
    { id: 'martin-odegaard', name: 'Martin Ødegaard' },
    { id: 'declan-rice', name: 'Declan Rice' },
    { id: 'bukayo-saka', name: 'Bukayo Saka' },
    { id: 'gabriel-martinelli', name: 'Gabriel Martinelli' },
    { id: 'kai-havertz', name: 'Kai Havertz' },
    { id: 'leandro-trossard', name: 'Leandro Trossard' },
];

const seasons = [
    { id: '2025-26', name: 'Season 2025/26' },
    { id: '2024-25', name: 'Season 2024/25' },
    { id: '2023-24', name: 'Season 2023/24' },
    { id: '2022-23', name: 'Season 2022/23' },
    { id: '2021-22', name: 'Season 2021/22' },
    { id: '2020-21', name: 'Season 2020/21' },
    { id: '2019-20', name: 'Season 2019/20' },
];

interface KnowledgeSidebarProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export function KnowledgeSidebar({ activeCategory, onCategoryChange }: KnowledgeSidebarProps) {
    const [selectedSeason, setSelectedSeason] = useState("2025-26");
    const [isPlayersExpanded, setIsPlayersExpanded] = useState(false);
    const [isSeasonsExpanded, setIsSeasonsExpanded] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
    const [selectedSeasonItem, setSelectedSeasonItem] = useState(seasons[0]);

    return (
        <div className="flex flex-col h-full bg-card/10 border-r">
            <div className="p-4 border-b bg-card/30">
                <div className="flex items-center space-x-2 text-red-600 mb-4">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Research Filters</span>
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

                    {/* Players Modal */}
                    <button
                        onClick={() => setIsPlayersExpanded(!isPlayersExpanded)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group",
                            isPlayersExpanded
                                ? "bg-red-600 text-white shadow-md shadow-red-200"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center space-x-3">
                            <Users className={cn("w-4 h-4", isPlayersExpanded ? "text-white" : "text-red-600")} />
                            <span>Players</span>
                        </div>
                        {isPlayersExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        )}
                    </button>

                    {isPlayersExpanded && (
                        <div className="ml-6 space-y-1 max-h-40 overflow-y-auto">
                            {players.map((player) => (
                                <button
                                    key={player.id}
                                    onClick={() => {
                                        onCategoryChange(player.id);
                                        setSelectedPlayer(player);
                                        setIsPlayersExpanded(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group text-left",
                                        activeCategory === player.id
                                            ? "bg-red-600 text-white shadow-md shadow-red-200"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    <span className="text-[11px]">{player.name}</span>
                                    {activeCategory === player.id && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Seasons Modal */}
                    <button
                        onClick={() => setIsSeasonsExpanded(!isSeasonsExpanded)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group",
                            isSeasonsExpanded
                                ? "bg-red-600 text-white shadow-md shadow-red-200"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center space-x-3">
                            <Trophy className={cn("w-4 h-4", isSeasonsExpanded ? "text-white" : "text-red-600")} />
                            <span>Seasonal Archives</span>
                        </div>
                        {isSeasonsExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        )}
                    </button>

                    {isSeasonsExpanded && (
                        <div className="ml-6 space-y-1 max-h-40 overflow-y-auto">
                            {seasons.map((season) => (
                                <button
                                    key={season.id}
                                    onClick={() => {
                                        onCategoryChange(season.id);
                                        setSelectedSeasonItem(season);
                                        setIsSeasonsExpanded(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group text-left",
                                        activeCategory === season.id
                                            ? "bg-red-600 text-white shadow-md shadow-red-200"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    <span className="text-[11px]">{season.name}</span>
                                    {activeCategory === season.id && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    )}
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
