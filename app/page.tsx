'use client';

import { useGraph } from '@/lib/store/graph-context';
import { MetricsDashboard } from '@/components/dashboard/metrics-dashboard';
import { GraphCanvas } from '@/components/graph/graph-canvas';
import { NodeDrawer } from '@/components/graph/node-drawer';
import { ShortestPathExplorer } from '@/components/graph/shortest-path-explorer';

export default function Home() {
  const { selectedNodeId, isPathMode } = useGraph();

  return (
    <div className="absolute inset-0 w-full h-full flex overflow-hidden">
      {isPathMode ? (
        <>
          <GraphCanvas />
          <ShortestPathExplorer />
          <NodeDrawer />
        </>
      ) : selectedNodeId ? (
        <>
          <GraphCanvas />
          <NodeDrawer />
        </>
      ) : (
        <MetricsDashboard />
      )}
    </div>
  );
}
