'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { QueryResponse } from '@/types/api';
import { KnowledgeAnalysis } from '@/components/explore/KnowledgeAnalysis';
import { SourceVerification } from '@/components/explore/SourceVerification';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonPanelProps {
    side: 'left' | 'right';
    placeholder: string;
}

export function ComparisonPanel({ side, placeholder }: ComparisonPanelProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<QueryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await api.query({
                message: searchQuery,
                n_results: 5 // Fewer results for comparison mode
            });
            setResults(response);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-background relative",
            side === 'left' ? "border-r" : ""
        )}>
            {/* Search Header */}
            <div className="p-4 border-b bg-card/20 sticky top-0 z-10 transition-colors focus-within:bg-card/40">
                <div className="flex items-center space-x-2 text-red-600 mb-3 ml-1">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Compare Subject {side === 'left' ? 'Alpha' : 'Beta'}
                    </span>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(query);
                    }}
                    className="relative group"
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
                    <Input
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 h-10 bg-background/50 border-2 border-transparent focus-visible:border-red-600/20 focus-visible:ring-0 transition-all text-sm"
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                        </div>
                    )}
                </form>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden divide-y">
                {/* Analysis Section (Compact) */}
                <div className="flex-[2] overflow-hidden">
                    <KnowledgeAnalysis
                        query={query}
                        isLoading={isLoading}
                        results={results}
                        isCompact={true}
                    />
                </div>

                {/* Source Section (Compact) */}
                <div className="flex-1 overflow-hidden bg-card/5">
                    <SourceVerification
                        sources={results?.results || []}
                        isLoading={isLoading}
                        isCompact={true}
                    />
                </div>
            </div>
        </div>
    );
}
