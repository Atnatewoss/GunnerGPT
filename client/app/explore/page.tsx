'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { QueryResponse, HealthResponse } from '@/types/api';
import { SearchInterface } from '@/components/SearchInterface';
import { EvidenceDisplay } from '@/components/EvidenceDisplay';
import { KnowledgeStats } from '@/components/KnowledgeStats';
import { ExplorationPaths } from '@/components/ExplorationPaths';

export default function KnowledgeExplorer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<HealthResponse | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Knowledge Explore</h1>
          <p className="text-muted-foreground">
            Search and analyze the Arsenal intelligence database.
          </p>
        </div>
        <div className="flex justify-end items-start pt-2">
          <KnowledgeStats stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Search & Exploration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card p-1 shadow-sm">
            <SearchInterface
              onSearch={handleSearch}
              isLoading={isLoading}
              query={query}
              setQuery={setQuery}
            />
          </div>

          <ExplorationPaths />
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2">
          <div className="min-h-[400px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                <p className="text-sm text-muted-foreground animate-pulse">Consulting intelligence records...</p>
              </div>
            )}

            {!isLoading && !results && (
              <div className="text-center py-24 border-2 border-dashed rounded-xl bg-card/10">
                <Search className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  System Awaiting Input
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                  Enter a query to retrieve evidence-based insights from match history,
                  player statistics, and tactical archives.
                </p>
              </div>
            )}

            {!isLoading && results && (
              <EvidenceDisplay
                results={results.results}
                query={results.query}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
