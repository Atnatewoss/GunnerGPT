'use client';

import { Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { HealthResponse } from '../types/api';

interface KnowledgeStatsProps {
  stats: HealthResponse | null;
}

export function KnowledgeStats({ stats }: KnowledgeStatsProps) {
  if (!stats) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Activity className="w-4 h-4 animate-pulse" />
        <span>Loading system status...</span>
      </div>
    );
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const allSystemsHealthy = stats.status === 'healthy';

  return (
    <div className="flex items-center space-x-4">
      {/* Overall Status */}
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border">
        {getStatusIcon(allSystemsHealthy)}
        <span className={`text-sm font-medium ${getStatusColor(allSystemsHealthy)}`}>
          {allSystemsHealthy ? 'All Systems Online' : 'Some Systems Offline'}
        </span>
      </div>

      {/* Individual Status */}
      <div className="hidden md:flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          {getStatusIcon(stats.model_loaded)}
          <span className={getStatusColor(stats.model_loaded)}>
            Embeddings
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon(stats.chroma_connected)}
          <span className={getStatusColor(stats.chroma_connected)}>
            Vector Store
          </span>
        </div>
      </div>
    </div>
  );
}
