'use client';

import { useState } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
}

export function SearchInterface({ onSearch, isLoading, query, setQuery }: SearchInterfaceProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const suggestedQueries = [
    "Arsenal's tactical formations under Arteta",
    "Player performance metrics 2023-24 season",
    "Historical match analysis against Manchester United",
    "Transfer strategy and recruitment patterns",
    "Set-piece effectiveness analysis"
  ];

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Arsenal's knowledge base..."
              className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-arsenal-red focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-arsenal-red text-white px-3 py-1.5 rounded-md hover:bg-arsenal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Explore</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Advanced Search Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">Advanced Search</span>
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="p-4 bg-card border rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Time Period
              </label>
              <select className="w-full p-2 border border-input rounded-md bg-background">
                <option>All Time</option>
                <option>2023-24 Season</option>
                <option>2022-23 Season</option>
                <option>Historical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Content Type
              </label>
              <select className="w-full p-2 border border-input rounded-md bg-background">
                <option>All Types</option>
                <option>Match Analysis</option>
                <option>Player Stats</option>
                <option>Tactical Analysis</option>
                <option>Transfer Data</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Queries */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Suggested Explorations</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
