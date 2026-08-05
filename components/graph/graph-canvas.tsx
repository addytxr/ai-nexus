'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useGraph } from '@/lib/store/graph-context';
import { Loader2 } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export function GraphCanvas() {
  const { selectedNodeId, setSelectedNodeId, graphDepth, setGraphDepth, isPathMode, shortestPath } = useGraph();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setDimensions({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { data: pathData, isLoading: pathLoading } = useQuery({
    queryKey: ['path', shortestPath?.source, shortestPath?.target],
    queryFn: () => fetch(`/api/graph/path?source=${shortestPath!.source}&target=${shortestPath!.target}`).then(r => r.json()),
    enabled: !!(isPathMode && shortestPath)
  });

  const { data: neighborData, isLoading: neighborLoading } = useQuery({
    queryKey: ['neighbors', selectedNodeId, graphDepth],
    queryFn: () => fetch(`/api/graph/neighbors?nodeId=${selectedNodeId}&depth=${graphDepth}`).then(r => r.json()),
    enabled: !!(!isPathMode && selectedNodeId)
  });

  const activeData = isPathMode ? pathData?.data : neighborData?.data;
  const isLoading = isPathMode ? pathLoading : neighborLoading;
  const graphData = activeData || { nodes: [], edges: [] };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links = graphData.edges?.map((e: any) => ({
    source: e.source,
    target: e.target,
    name: e.type,
    color: 'rgba(150, 150, 150, 0.4)'
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#0a0a0a]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Graph controls overlay */}
      {!isPathMode && (
        <div className="absolute bottom-6 left-6 z-10 flex bg-card/80 backdrop-blur border border-border/50 rounded-lg overflow-hidden shadow-lg">
          {[1, 2, 3].map(depth => (
            <button
              key={depth}
              onClick={() => setGraphDepth(depth)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                graphDepth === depth 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent text-muted-foreground'
              }`}
            >
              Depth {depth}
            </button>
          ))}
        </div>
      )}

      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{ nodes: graphData.nodes, links }}
        nodeId="id"
        nodeLabel="name"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodeColor={(n: any) => n.id === selectedNodeId ? '#ffffff' : (n.color || '#888')}
        nodeRelSize={6}
        linkColor="color"
        linkWidth={1.5}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 50);
          }
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.id === selectedNodeId ? '#ffffff' : (node.color || '#cccccc');
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.id === selectedNodeId ? 7 : 5, 0, 2 * Math.PI, false);
          ctx.fill();
          
          if (globalScale > 1.5 || node.id === selectedNodeId) {
            ctx.fillText(label, node.x, node.y + (node.id === selectedNodeId ? 10 : 8));
          }
        }}
      />
    </div>
  );
}
