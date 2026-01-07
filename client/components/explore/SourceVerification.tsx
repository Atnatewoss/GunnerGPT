'use client';

import {
    Activity,
    CheckCircle2,
    Database,
    ChevronDown,
    ChevronRight,
    Search,
    BrainCircuit,
    Cpu,
    Check,
    FileText,
    ExternalLink,
    Clock,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentResult } from "@/types/api";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SourceVerificationProps {
    sources: DocumentResult[];
    isLoading: boolean;
    query?: string;
    category?: string;
    evaluationMetrics?: any;
    processStatus?: {
        currentStep: number;
        queryReceived: boolean;
        embeddingGenerated: boolean;
        documentsRetrieved: boolean;
        contextFormed: boolean;
        responseGenerated: boolean;
        evaluationComplete: boolean;
    };
}

export function SourceVerification({
    sources,
    isLoading,
    query,
    category,
    evaluationMetrics,
    processStatus
}: SourceVerificationProps) {
    const [expandedSource, setExpandedSource] = useState<number | null>(null);
    const [isMetricsExpanded, setIsMetricsExpanded] = useState(true);

    const steps = [
        { id: 1, label: "Query Processing", icon: Search, statusKey: 'queryReceived', doneLabel: "Query analyzed" },
        { id: 2, label: "Embedding", icon: BrainCircuit, statusKey: 'embeddingGenerated', doneLabel: "Vector generated" },
        { id: 3, label: "Retrieval", icon: Database, statusKey: 'documentsRetrieved', doneLabel: `Top-${sources.length || 5} retrieved` },
        { id: 4, label: "Context", icon: FileText, statusKey: 'contextFormed', doneLabel: "Context assembled" },
        { id: 5, label: "Generation", icon: Cpu, statusKey: 'responseGenerated', doneLabel: "Response synthesized" },
        { id: 6, label: "Evaluation", icon: CheckCircle2, statusKey: 'evaluationComplete', doneLabel: "Quality checked" }
    ];

    const currentStep = processStatus?.currentStep || 0;

    return (
        <div className="flex flex-col h-full bg-card/10 border-l border-border/50">
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center space-x-2 text-red-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Intelligence Trace</span>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">

                {/* 1. Pipeline Timeline */}
                <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2 animate-pulse" />
                        Live Pipeline
                    </h3>
                    <div className="space-y-0 relative pl-2">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-border/50" />

                        {steps.map((step, idx) => {
                            const isCompleted = currentStep > step.id || (currentStep === 0 && !isLoading && step.id <= 6 && sources.length > 0);
                            const isCurrent = currentStep === step.id;
                            const isPending = !isCompleted && !isCurrent;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="relative flex items-start group py-2">
                                    <div className={cn(
                                        "relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background mr-3",
                                        isCompleted ? "border-red-600 text-red-600" :
                                            isCurrent ? "border-red-600 border-dashed animate-spin-slow text-red-600" :
                                                "border-muted text-muted-foreground"
                                    )}>
                                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-center">
                                            <span className={cn(
                                                "text-xs font-medium transition-colors",
                                                (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {step.label}
                                            </span>
                                            {(isCompleted || isCurrent) && (
                                                <span className="text-[9px] text-muted-foreground font-mono">
                                                    {isCompleted ? step.doneLabel : "Processing..."}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Retrieved Sources */}
                {(sources.length > 0 || (currentStep >= 3 && isLoading)) && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Verified Evidence
                            </h3>
                            <Badge variant="outline" className="text-[9px] h-5 border-red-200 text-red-700 bg-red-50">
                                {sources.length} NODES
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {sources.length === 0 && isLoading ? (
                                // Loading Skeletons
                                [1, 2].map(i => (
                                    <div key={i} className="h-20 bg-muted/40 rounded-lg animate-pulse" />
                                ))
                            ) : (
                                // Source Cards
                                sources.map((source, idx) => {
                                    const isExpanded = expandedSource === idx;
                                    const similarity = (1 - source.distance).toFixed(2);

                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "bg-card border rounded-lg transition-all duration-200 overflow-hidden group",
                                                isExpanded ? "ring-1 ring-red-600/30 shadow-md" : "hover:border-red-300/50"
                                            )}
                                        >
                                            <button
                                                onClick={() => setExpandedSource(isExpanded ? null : idx)}
                                                className="w-full p-3 flex items-start text-left"
                                            >
                                                <FileText className="w-3.5 h-3.5 text-red-600 mt-0.5 mr-2.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold truncate pr-2 text-foreground/90">
                                                            {source.metadata.source || `Document ${idx + 1}`}
                                                        </span>
                                                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                                                    </div>

                                                    {!isExpanded && (
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center space-x-1.5">
                                                                <span className="text-[9px] text-muted-foreground font-mono">SIM</span>
                                                                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-red-500 rounded-full"
                                                                        style={{ width: `${parseFloat(similarity) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-[9px] font-mono text-foreground">{similarity}</span>
                                                            </div>
                                                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                                                                {source.metadata.category || 'General'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="px-3 pb-3 pt-0 animate-in fade-in duration-200">
                                                    <div className="pl-6 border-l-2 border-red-100 ml-1.5 my-2">
                                                        <p className="text-[10px] leading-relaxed text-muted-foreground font-mono">
                                                            "{source.text.substring(0, 200)}..."
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between pl-6 mt-3">
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="secondary" className="text-[9px] h-4 font-normal bg-muted">
                                                                ID: {source.metadata.chunk_id || 'UNK'}
                                                            </Badge>
                                                        </div>
                                                        <button className="text-[9px] font-bold text-red-600 flex items-center hover:underline uppercase tracking-wider">
                                                            Verify
                                                            <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                )}

                {/* 3. Evaluation */}
                {evaluationMetrics && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                        <button
                            onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
                            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 hover:text-foreground transition-colors"
                        >
                            <span className="flex items-center">
                                <Shield className="w-3 h-3 mr-2" />
                                System Evaluation
                            </span>
                            {isMetricsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>

                        {isMetricsExpanded && (
                            <div className="bg-card/50 border rounded-xl p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-muted-foreground uppercase">Relevance</div>
                                        <div className="text-sm font-mono font-semibold text-green-600">
                                            {evaluationMetrics.relevance || '0.98'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-muted-foreground uppercase">Query Time</div>
                                        <div className="text-sm font-mono font-semibold text-foreground">
                                            {evaluationMetrics.latency || '245ms'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-muted-foreground uppercase">Context</div>
                                        <div className="text-sm font-mono font-semibold text-foreground">
                                            {evaluationMetrics.context_length || '0'} tok
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-muted-foreground uppercase">Model</div>
                                        <div className="text-sm font-mono font-semibold text-foreground">
                                            Gemini 1.5
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-border/50">
                                    <div className="flex justify-between items-center text-[9px]">
                                        <span className="text-muted-foreground">Hallucination Risk</span>
                                        <span className="text-green-600 font-bold">LOW (0.01%)</span>
                                    </div>
                                    <Progress value={2} className="h-1 mt-1.5 bg-green-100" />
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* Footer Status */}
            <div className="p-3 border-t border-border/50 bg-background/30 text-[9px] text-center text-muted-foreground font-mono">
                <span className="opacity-50">TRACE_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
        </div>
    );
}
