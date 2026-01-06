'use client';

import {
    ShieldCheck,
    ExternalLink,
    FileSearch,
    Database,
    Tag,
    CheckCircle,
    Search,
    Layers,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DocumentResult } from "@/types/api";

interface SourceVerificationProps {
    sources: DocumentResult[];
    isLoading: boolean;
    isCompact?: boolean;
    query?: string;
    category?: string;
    evaluationMetrics?: any;
    processStatus?: {
        currentStep?: number;
        queryReceived?: boolean;
        embeddingGenerated?: boolean;
        documentsRetrieved?: boolean;
        contextFormed?: boolean;
        responseGenerated?: boolean;
        evaluationComplete?: boolean;
    };
}

export function SourceVerification({ sources, isLoading, isCompact, query, category, evaluationMetrics, processStatus }: SourceVerificationProps) {
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
                
                {/* Query Process Status */}
                {!isCompact && processStatus && (
                    <div className="mb-4 p-2 bg-background/50 rounded-lg border">
                        <div className="text-xs font-semibold mb-2 text-foreground">Query Process Status</div>
                        <div className="grid grid-cols-2 gap-1 text-[9px]">
                            <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${processStatus.queryReceived ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={processStatus.queryReceived ? 'text-green-700' : 'text-gray-500'}>Query received</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${processStatus.embeddingGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={processStatus.embeddingGenerated ? 'text-green-700' : 'text-gray-500'}>Embedding generated</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${processStatus.documentsRetrieved ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={processStatus.documentsRetrieved ? 'text-green-700' : 'text-gray-500'}>Documents retrieved</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${processStatus.contextFormed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={processStatus.contextFormed ? 'text-green-700' : 'text-gray-500'}>Context formed</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${processStatus.responseGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={processStatus.responseGenerated ? 'text-green-700' : 'text-gray-500'}>Response generated</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${processStatus.evaluationComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={processStatus.evaluationComplete ? 'text-green-700' : 'text-gray-500'}>Evaluation complete</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Process Steps */}
                {!isCompact && (
                    <p className="text-[10px] text-muted-foreground leading-normal mb-4">
                        Direct citations from intelligence layer used to synthesize the analysis.
                    </p>
                )}
                
                {/* RAG Process Display */}
                <div className="space-y-3">
                    <div className={`flex items-center space-x-3 mb-3 ${processStatus?.currentStep === 1 ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            processStatus?.currentStep === 1 ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                            <Search className={`w-3 h-3 ${
                                processStatus?.currentStep === 1 ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium text-foreground ${
                                processStatus?.currentStep === 1 ? 'text-blue-600' : ''
                            }`}>1. Query Processing</h4>
                            <p className="text-xs text-muted-foreground">User query parsed and embedded for semantic search</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center space-x-3 mb-3 ${processStatus?.currentStep === 2 ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            processStatus?.currentStep === 2 ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                            <Database className={`w-3 h-3 ${
                                processStatus?.currentStep === 2 ? 'text-indigo-600' : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium text-foreground ${
                                processStatus?.currentStep === 2 ? 'text-indigo-600' : ''
                            }`}>2. Top-K Retrieval</h4>
                            <p className="text-xs text-muted-foreground">Vector similarity search retrieves top-5 most relevant documents</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center space-x-3 mb-3 ${processStatus?.currentStep === 3 ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            processStatus?.currentStep === 3 ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                            <Layers className={`w-3 h-3 ${
                                processStatus?.currentStep === 3 ? 'text-green-600' : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium text-foreground ${
                                processStatus?.currentStep === 3 ? 'text-green-600' : ''
                            }`}>3. Context Formation</h4>
                            <p className="text-xs text-muted-foreground">Retrieved documents ranked and formatted into structured context</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center space-x-3 mb-3 ${processStatus?.currentStep === 4 ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            processStatus?.currentStep === 4 ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                            <Sparkles className={`w-3 h-3 ${
                                processStatus?.currentStep === 4 ? 'text-purple-600' : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium text-foreground ${
                                processStatus?.currentStep === 4 ? 'text-purple-600' : ''
                            }`}>4. Response Generation</h4>
                            <p className="text-xs text-muted-foreground">Language model processes context and generates comprehensive response</p>
                        </div>
                    </div>
                    
                    <div className={`flex items-center space-x-3 mb-3 ${processStatus?.currentStep === 5 ? 'opacity-100' : 'opacity-60'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            processStatus?.currentStep === 5 ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                            <CheckCircle className={`w-3 h-3 ${
                                processStatus?.currentStep === 5 ? 'text-orange-600' : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                            <h4 className={`text-sm font-medium text-foreground ${
                                processStatus?.currentStep === 5 ? 'text-orange-600' : ''
                            }`}>5. Evaluation</h4>
                            <p className="text-xs text-muted-foreground">Response quality assessed using RAG-specific metrics and accuracy checks</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
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
            </div>
            
            {/* Evaluation Metrics */}
            {evaluationMetrics && (
                <div className="p-4 border-t bg-card/30">
                    <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <h4 className="text-sm font-semibold text-foreground">Evaluation</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <h5 className="font-semibold mb-2">Performance Metrics</h5>
                            <div className="space-y-1">
                                {evaluationMetrics.recall && (
                                    <div className="flex justify-between">
                                        <span>Recall:</span>
                                        <span className="font-mono">{evaluationMetrics.recall}</span>
                                    </div>
                                )}
                                {evaluationMetrics.relevance && (
                                    <div className="flex justify-between">
                                        <span>Relevance:</span>
                                        <span className="font-mono">{evaluationMetrics.relevance}</span>
                                    </div>
                                )}
                                {evaluationMetrics.latency && (
                                    <div className="flex justify-between">
                                        <span>Latency:</span>
                                        <span className="font-mono">{evaluationMetrics.latency}ms</span>
                                    </div>
                                )}
                                {evaluationMetrics.hallucination_rate && (
                                    <div className="flex justify-between">
                                        <span>Hallucination Rate:</span>
                                        <span className="font-mono">{evaluationMetrics.hallucination_rate}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-semibold mb-2">Context Analysis</h5>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span>Context Length:</span>
                                    <span className="font-mono">{evaluationMetrics.context_length || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sources Used:</span>
                                    <span className="font-mono">{evaluationMetrics.sources_count || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Category Scope:</span>
                                    <span className="font-mono">{evaluationMetrics.category || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
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
