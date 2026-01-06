'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { QueryResponse, HealthResponse } from '@/types/api';
import { KnowledgeSidebar } from '@/components/explore/KnowledgeSidebar';
import { KnowledgeAnalysis } from '@/components/explore/KnowledgeAnalysis';
import { SourceVerification } from '@/components/explore/SourceVerification';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Send } from 'lucide-react';

function KnowledgeExplorerContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<HealthResponse | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [submittedCategory, setSubmittedCategory] = useState('');

  useEffect(() => {
    loadStats();
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const loadStats = async () => {
    try {
      const healthResponse = await api.health();
      setStats(healthResponse);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.query({
        message: searchQuery,
        n_results: 10
      });
      setResults(response);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSubmittedQuery(query);
    setSubmittedCategory(activeCategory);
    setIsLoading(true);
    
    try {
      const response = await api.query({
        message: query,
        n_results: 5,
      });
      setResults(response);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
      // Clear the input box after submission
      setQuery('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex bg-background border border-[#E30613]/10 rounded-2xl overflow-hidden shadow-2xl h-[calc(100vh-50px)] animate-in fade-in duration-1000">
        {/* Left Panel: Filters & Categories */}
        <aside className="w-64 flex-shrink-0">
          <KnowledgeSidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </aside>

        {/* Main Panel: Structured Analysis */}
        <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {submittedQuery && (
              <div className="p-6 space-y-4">
                <div className="bg-card/50 border rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-2">Query Input</h3>
                  <p className="text-muted-foreground">{submittedQuery}</p>
                </div>
                <div className="bg-card/50 border rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-2">Active Category</h3>
                  <p className="text-muted-foreground">{submittedCategory}</p>
                </div>
                {results && (
                  <div className="bg-card/50 border rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-2">Results ({results.results.length})</h3>
                    <div className="space-y-3">
                      {results.results.map((result, index) => (
                        <div key={index} className="p-3 bg-background rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-2">{result.text}</p>
                          {result.metadata && (
                            <div className="text-xs text-muted-foreground">
                              {Object.entries(result.metadata).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {String(value)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!submittedQuery && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Enter a query and click send to get started</p>
              </div>
            )}
          </div>

          {/* Search Input at Bottom */}
          <div className="p-4 border-t bg-card/20 z-10">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
                <Input
                  placeholder="Query the Arsenal Intelligence Layer..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-10 bg-background/50 border-2 border-transparent focus-visible:border-red-600/20 focus-visible:ring-0 transition-all"
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                className="h-10 w-10"
                disabled={!query.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
              {isLoading && (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                </div>
              )}
            </form>
          </div>
        </main>

        {/* Right Panel: Evidence & Sources */}
        <aside className="w-80 flex-shrink-0 hidden lg:block">
          <SourceVerification
            sources={results?.results || []}
            isLoading={isLoading}
            query={submittedQuery}
            category={submittedCategory}
            evaluationMetrics={results ? {
              recall: '0.85', // Example metric
              relevance: '0.92',
              latency: '245ms',
              hallucination_rate: '0.03',
              context_length: submittedQuery.length,
              sources_count: results?.results.length || 0,
              category: submittedCategory
            } : undefined}
          />
        </aside>
      </div>
    </div>
  );
}

export default function KnowledgeExplorer() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    }>
      <KnowledgeExplorerContent />
    </Suspense>
  );
}
