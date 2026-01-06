'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, TrendingUp, Award, Users, Target } from 'lucide-react';
import { api } from '../lib/api';
import { QueryResponse, DocumentResult, HealthResponse } from '../types/api';
import { SearchInterface } from '../components/SearchInterface';
import { EvidenceDisplay } from '../components/EvidenceDisplay';
import { KnowledgeStats } from '../components/KnowledgeStats';
import { ExplorationPaths } from '../components/ExplorationPaths';

export default function KnowledgeExplorer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<HealthResponse['services'] | null>(null);

  useEffect(() => {
    // Load initial stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const healthResponse = await api.health();
      setStats(healthResponse.services);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 arsenal-gradient rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Arsenal Knowledge Explorer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Evidence-based football intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <KnowledgeStats stats={stats} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search & Exploration */}
          <div className="lg:col-span-1 space-y-6">
            <SearchInterface
              onSearch={handleSearch}
              isLoading={isLoading}
              query={query}
              setQuery={setQuery}
            />

            <ExplorationPaths />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arsenal-red"></div>
              </div>
            )}

            {!isLoading && !results && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Explore Arsenal's Knowledge Base
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Search through match history, player statistics, tactical analysis,
                  and club documentation with evidence-based results.
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
      </main>
    </div>
  );
}
