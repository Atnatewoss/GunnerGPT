'use client';

import {
    FileText,
    Lightbulb,
    Target,
    AlertCircle,
    TrendingUp,
    Download,
    Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface KnowledgeAnalysisProps {
    query: string;
    isLoading: boolean;
    results: any | null; // This would ideally be typed once the backend returns structured data
    isCompact?: boolean;
}

export function KnowledgeAnalysis({ query, isLoading, results, isCompact }: KnowledgeAnalysisProps) {
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Target className="w-6 h-6 text-red-600 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold tracking-tight">Retrieving Intelligence</h2>
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Scanning 12k+ documents for semantic alignment...
                    </p>
                </div>
                <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 animate-[progress_2s_ease-in-out_infinite]" />
                </div>
            </div>
        );
    }

    if (!results && !query) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Knowledge Nexus</h2>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm">
                    The central hub for Arsenal tactical and historical intelligence.
                    Enter a query to begin analysis.
                </p>
            </div>
        );
    }

    // Mocked structured data for demonstration
    const mockAnalysis = {
        title: results?.query || query,
        summary: "Comprehensive tactical analysis derived from multiple performance archives and technical reports. The system has identified high-correlating patterns in positional rotation and transition structures.",
        points: [
            {
                title: "Primary Tactical Pattern",
                content: "Identified a recurring 3-2-5 structure in the build-up phase, facilitating high-line pressure and defensive security during turnovers.",
                icon: Target
            },
            {
                title: "Performance Consistency",
                content: "Data indicates a 14% improvement in second-ball recovery rates compared to previous seasonal benchmarks.",
                icon: TrendingUp
            },
            {
                title: "Intelligence Note",
                content: "Source attribution suggests this pattern is most prevalent during mid-block defensive transitions.",
                icon: Lightbulb
            }
        ]
    };

    return (
        <div className="h-full flex flex-col bg-background animate-in fade-in duration-700">
            <div className={cn("p-6 border-b bg-card/10 flex items-center justify-between", isCompact && "p-3")}>
                <div>
                    <div className="flex items-center space-x-2 text-red-600 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Analytical Report</span>
                    </div>
                    <h1 className={cn("text-2xl font-bold tracking-tight", isCompact && "text-lg")}>{mockAnalysis.title}</h1>
                </div>
                {!isCompact && (
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className={cn("flex-1 overflow-hidden p-6 space-y-8 pb-0", isCompact && "p-4 space-y-4 pb-0")}>
                <section className={cn("space-y-4", isCompact && "space-y-2")}>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-red-600" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-wider">Executive Summary</h2>
                    </div>
                    <div className={cn(
                        "bg-card/50 border rounded-xl p-5 leading-relaxed text-sm text-foreground/90 border-l-4 border-l-red-600",
                        isCompact && "p-3 text-xs"
                    )}>
                        {mockAnalysis.summary}
                    </div>
                </section>

                <section className={cn("space-y-6", isCompact && "space-y-3")}>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-red-600" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-wider">Key Research Insights</h2>
                    </div>

                    <div className="grid gap-4">
                        {mockAnalysis.points.map((point, i) => {
                            const Icon = point.icon;
                            return (
                                <div key={i} className={cn(
                                    "flex space-x-4 p-4 rounded-xl border bg-card/30 hover:bg-card/50 transition-colors",
                                    isCompact && "p-3 space-x-3"
                                )}>
                                    <div className="mt-1">
                                        <Icon className={cn("w-5 h-5 text-red-600", isCompact && "w-4 h-4")} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className={cn("font-bold text-sm", isCompact && "text-xs")}>{point.title}</h3>
                                        <p className={cn("text-sm text-muted-foreground leading-relaxed leading-normal", isCompact && "text-[11px]")}>
                                            {point.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="space-y-4 pt-4">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="methodology" className="border rounded-xl px-4 bg-muted/30">
                            <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:no-underline">
                                Research Methodology
                            </AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                                Analysis performed using Recursive Character Text Splitting with
                                Multi-vector Retrieval. Results are ranked by cosine similarity
                                within the HNSW index space. Accuracy threshold: 0.85.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>
            </div>

            {!isCompact && (
                <div className="p-4 bg-muted/30 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center">
                            <Target className="w-3 h-3 mr-1.5" />
                            Reasoning: Inductive
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>Confidence: 94.2%</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                        GUNNER-GPT / KNOWLEDGE-ENGINE v4.0.1
                    </div>
                </div>
            )}
        </div>
    );
}
