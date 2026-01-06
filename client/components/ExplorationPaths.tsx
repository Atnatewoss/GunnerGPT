'use client';

import { useState } from 'react';
import { Compass, Trophy, Target, Zap, BookOpen, Users } from 'lucide-react';

export function ExplorationPaths() {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const explorationPaths = [
    {
      id: 'tactics',
      title: 'Tactical Analysis',
      description: 'Explore formations, strategies, and match tactics',
      icon: Target,
      color: 'bg-blue-500',
      queries: [
        'Arteta tactical evolution',
        'Formation changes 2023-24',
        'Set piece routines',
        'Pressing triggers'
      ]
    },
    {
      id: 'players',
      title: 'Player Intelligence',
      description: 'Performance metrics and player development',
      icon: Users,
      color: 'bg-green-500',
      queries: [
        'Saka performance analysis',
        'Ødegaard creative contributions',
        'Rice progression metrics',
        'Saliba defensive stats'
      ]
    },
    {
      id: 'history',
      title: 'Historical Data',
      description: 'Match history and club legacy',
      icon: BookOpen,
      color: 'bg-purple-500',
      queries: [
        'Invincibles season analysis',
        'Arsenal vs Tottenham history',
        'European campaigns',
        'Managerial evolution'
      ]
    },
    {
      id: 'achievements',
      title: 'Success Metrics',
      description: 'Trophies and achievements',
      icon: Trophy,
      color: 'bg-yellow-500',
      queries: [
        'Premier League titles',
        'FA Cup victories',
        'European successes',
        'Recent achievements'
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Exploration Paths
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {explorationPaths.map((path) => (
          <div key={path.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
            {/* Path Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-8 h-8 ${path.color} rounded-lg flex items-center justify-center`}>
                <path.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{path.title}</h4>
                <p className="text-sm text-muted-foreground">{path.description}</p>
              </div>
            </div>

            {/* Expandable Queries */}
            <div>
              <button
                onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>{expandedPath === path.id ? 'Hide' : 'Show'} Quick Queries</span>
              </button>

              {expandedPath === path.id && (
                <div className="mt-3 space-y-2">
                  {path.queries.map((query, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm bg-muted rounded hover:bg-muted/80 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gamification Element */}
      <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-red-600" />
          <div>
            <h4 className="font-medium text-red-900">Pro Tip</h4>
            <p className="text-sm text-red-800">
              Combine multiple exploration paths for deeper insights. Try cross-referencing tactical analysis with player performance data!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
