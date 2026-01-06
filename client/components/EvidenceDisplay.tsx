'use client';

import { FileText, ExternalLink, TrendingUp, Users } from 'lucide-react';
import { DocumentResult } from '../types/api';

interface EvidenceDisplayProps {
  results: DocumentResult[];
  query: string;
}

export function EvidenceDisplay({ results, query }: EvidenceDisplayProps) {
  const getSimilarityColor = (distance: number) => {
    if (distance < 0.3) return 'text-green-600 bg-green-50';
    if (distance < 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSimilarityLabel = (distance: number) => {
    if (distance < 0.3) return 'High Match';
    if (distance < 0.6) return 'Medium Match';
    return 'Low Match';
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Evidence Results
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{results.length} sources found</span>
        </div>
      </div>

      {/* Query Summary */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <div className="flex items-start space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Query Analysis</h3>
            <p className="text-blue-800 text-sm">
              Exploring: <span className="font-semibold">"{query}"</span>
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="evidence-card">
            {/* Document Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="similarity-badge bg-gray-100 text-gray-800">
                  Source {index + 1}
                </span>
                <span className={`similarity-badge ${getSimilarityColor(result.distance)}`}>
                  {getSimilarityLabel(result.distance)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Similarity: {(1 - result.distance).toFixed(3)}
              </div>
            </div>

            {/* Document Metadata */}
            {result.metadata && (
              <div className="mb-3 p-2 bg-muted rounded text-xs">
                <div className="grid grid-cols-2 gap-2">
                  {result.metadata.source && (
                    <div>
                      <span className="font-medium">Source:</span> {result.metadata.source}
                    </div>
                  )}
                  {result.metadata.page && (
                    <div>
                      <span className="font-medium">Page:</span> {result.metadata.page}
                    </div>
                  )}
                  {result.metadata.chapter && (
                    <div>
                      <span className="font-medium">Chapter:</span> {result.metadata.chapter}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Document Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">
                {result.text}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center space-x-2">
              <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-3 h-3" />
                <span>View Source</span>
              </button>
              <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="w-3 h-3" />
                <span>Cite Evidence</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results State */}
      {results.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Evidence Found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try rephrasing your query or explore suggested topics to find relevant information about Arsenal.
          </p>
        </div>
      )}
    </div>
  );
}
