'use client';

import {
    ShieldCheck,
    ExternalLink,
    FileSearch,
    Database,
    Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DocumentResult } from "@/types/api";

interface SourceVerificationProps {
    sources: DocumentResult[];
    isLoading: boolean;
    isCompact?: boolean;
}

export function SourceVerification({ sources, isLoading, isCompact }: SourceVerificationProps) {
    return (
        <div className="flex flex-col h-full bg-card/5 border-l">
            <div className={cn("p-4 border-b bg-card/30", isCompact && "p-2")}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-red-600">
                        <ShieldCheck className="w-4 h-4" />
                        {!isCompact && <span className="text-xs font-bold uppercase tracking-[0.2em]">Source Evidence</span>}
                    </div>
                    <Badge variant="outline" className="text-[9px] h-5 bg-background font-bold tracking-widest border-red-200 text-red-700">
                        {sources.length} {isCompact ? '' : 'VERIFIED'}
                    </Badge>
                </div>
                {!isCompact && (
                    <p className="text-[10px] text-muted-foreground leading-normal">
                        Direct citations from the intelligence layer used to synthesize the analysis.
                    </p>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2 animate-pulse">
                                    <div className="h-3 w-3/4 bg-muted rounded" />
                                    <div className="h-20 w-full bg-muted rounded-lg" />
                                    <div className="flex space-x-2">
                                        <div className="h-4 w-12 bg-muted rounded" />
                                        <div className="h-4 w-12 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : sources.length > 0 ? (
                        sources.map((source, i) => (
                            <div
                                key={i}
                                className="group relative bg-background border rounded-lg p-4 transition-all hover:border-red-600/30 hover:shadow-md"
                            >
                                <div className="absolute -left-1 top-4 w-0.5 h-8 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Database className="w-3 h-3 text-red-600" />
                                        <span className="text-[10px] font-bold truncate max-w-[120px] uppercase tracking-wider">
                                            {source.metadata.source || 'Intelligence Record'}
                                        </span>
                                    </div>
                                    <div className="bg-muted px-1.5 py-0.5 rounded text-[9px] font-bold text-muted-foreground">
                                        SIM: {(1 - source.distance).toFixed(2)}
                                    </div>
                                </div>

                                <div className="text-[11px] leading-relaxed text-foreground/80 mb-3 italic border-l-2 pl-3 py-1 border-muted">
                                    "{source.text.length > 180 ? `${source.text.substring(0, 180)}...` : source.text}"
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <Tag className="w-2.5 h-2.5 mr-1" />
                                        {source.metadata.category || 'General'}
                                    </div>
                                    <button className="ml-auto text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[9px] font-bold uppercase tracking-widest hover:underline">
                                        Verify Link
                                        <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 space-y-3">
                            <FileSearch className="w-8 h-8 mx-auto text-muted-foreground/30" />
                            <p className="text-[11px] text-muted-foreground font-medium">
                                No active evidence in context.
                            </p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {!isCompact && (
                <div className="p-4 border-t bg-card/10 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                        Evidence Integrity Protocol v1.4
                    </p>
                </div>
            )}
        </div>
    );
}
