'use client';

import { useGraph } from '@/lib/store/graph-context';
import { MetricsDashboard } from '@/components/dashboard/metrics-dashboard';
import { GraphCanvas } from '@/components/graph/graph-canvas';
import { NodeDrawer } from '@/components/graph/node-drawer';
import { ShortestPathExplorer } from '@/components/graph/shortest-path-explorer';
import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { selectedNodeId, isPathMode } = useGraph();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Graph Area - Fills entire remaining viewport */}
      <div className="absolute inset-0">
        <GraphCanvas />
      </div>

      {/* Floating Overlays */}
      {isPathMode && <ShortestPathExplorer />}
      
      {/* Floating Welcome Context */}
      {!isPathMode && showWelcome && (
        <div className="absolute top-6 left-6 z-10 w-[380px] bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-2 py-1 rounded-md mb-2 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Welcome</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground hover:text-foreground rounded-full" onClick={() => setShowWelcome(false)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">AI Ecosystem Graph</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore the intricate relationships between AI models, tools, frameworks, and companies. Click on any node to reveal its dependencies, or use the top search bar to find something specific.
            </p>
          </div>
        </div>
      )}

      <NodeDrawer />
      
      {/* Floating Widgets */}
      {!isPathMode && <MetricsDashboard />}
    </div>
  );
}
