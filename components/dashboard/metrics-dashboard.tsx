'use client';

import { useQuery } from '@tanstack/react-query';
import { Network, Database, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { useState } from 'react';

export function MetricsDashboard() {
  const [expanded, setExpanded] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/graph/stats');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
  });

  return (
    <div className="absolute bottom-6 left-6 z-10 w-64 bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-card/30 hover:bg-card/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Graph Stats</span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="p-4 border-t border-border/30 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="w-3.5 h-3.5" />
              <span>Nodes</span>
            </div>
            <span className="font-mono font-medium">{isLoading ? '...' : data?.data?.totalNodes || 0}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Network className="w-3.5 h-3.5" />
              <span>Edges</span>
            </div>
            <span className="font-mono font-medium">{isLoading ? '...' : data?.data?.totalRelationships || 0}</span>
          </div>

          {data?.data?.labels && (
            <div className="pt-3 border-t border-border/30 mt-3 space-y-2">
              {Object.entries(data.data.labels).slice(0, 5).map(([label, count]) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground truncate max-w-[120px]">{label}</span>
                  <span className="font-mono">{count as number}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
