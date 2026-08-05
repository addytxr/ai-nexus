'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useGraph } from '@/lib/store/graph-context';
import { Loader2 } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export function GraphCanvas() {
  const { selectedNodeId, setSelectedNodeId, graphDepth, setGraphDepth, isPathMode, shortestPath, setDrawerOpen } = useGraph();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<string | null>(null);
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
  // Map colors by label
  const getColor = (label: string) => {
    const colors: Record<string, string> = {
      Model: '#3b82f6', // Blue
      Tool: '#10b981', // Emerald
      Company: '#f59e0b', // Amber
      Framework: '#8b5cf6', // Violet
      VectorDB: '#ec4899', // Pink
      Provider: '#06b6d4', // Cyan
      Integration: '#f97316', // Orange
      API: '#eab308', // Yellow
      Protocol: '#64748b', // Slate
      Category: '#ef4444', // Red
    };
    return colors[label] || '#888888';
  };

  const neighborIds = React.useMemo(() => {
    const activeNode = hoverNode || selectedNodeId;
    if (!activeNode || !activeData?.edges) return new Set<string>();
    
    const neighbors = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeData.edges.forEach((e: any) => {
      const sourceId = typeof e.source === 'object' ? e.source.id : e.source;
      const targetId = typeof e.target === 'object' ? e.target.id : e.target;
      if (sourceId === activeNode) neighbors.add(targetId);
      if (targetId === activeNode) neighbors.add(sourceId);
    });
    return neighbors;
  }, [hoverNode, selectedNodeId, activeData]);

  const graphData = activeData || { nodes: [], edges: [] };

  // Set colors and properties on nodes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphData.nodes.forEach((n: any) => {
    n.color = getColor(n.label);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    setSelectedNodeId(node.id);
    setDrawerOpen(true);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2.5, 1000);
    }
  }, [setSelectedNodeId, setDrawerOpen]);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-background dark:bg-background/95">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Graph controls overlay */}
      {!isPathMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center bg-background/80 backdrop-blur-xl border border-border/50 rounded-full p-1.5 shadow-xl">
          {[1, 2, 3].map(depth => (
            <button
              key={depth}
              onClick={() => setGraphDepth(depth)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                graphDepth === depth 
                  ? 'bg-foreground text-background shadow-sm' 
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              {depth} Hop{depth > 1 ? 's' : ''}
            </button>
          ))}
          <div className="w-px h-4 bg-border/50 mx-2" />
          <button
            onClick={() => {
              if (graphRef.current) graphRef.current.zoomToFit(800, 50);
            }}
            className="px-4 py-1.5 text-xs font-medium rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
          >
            Fit
          </button>
        </div>
      )}

      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{ nodes: graphData.nodes, links: graphData.edges || [] }}
        nodeId="id"
        nodeLabel="name"
        nodeRelSize={6}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkColor={(link: any) => {
          const isPathEdge = isPathMode && shortestPath;
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const activeNode = hoverNode || selectedNodeId;
          const isConnected = activeNode && (sourceId === activeNode || targetId === activeNode);
          return isPathEdge ? 'rgba(59, 130, 246, 0.8)' : isConnected ? 'rgba(150, 150, 150, 0.6)' : 'rgba(150, 150, 150, 0.15)';
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkWidth={(link: any) => {
          const isPathEdge = isPathMode && shortestPath;
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const activeNode = hoverNode || selectedNodeId;
          const isConnected = activeNode && (sourceId === activeNode || targetId === activeNode);
          return isPathEdge ? 2 : isConnected ? 1.5 : 0.8;
        }}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.2}
        onNodeClick={handleNodeClick}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeHover={(node: any) => {
          setHoverNode(node ? node.id : null);
          if (containerRef.current) {
            containerRef.current.style.cursor = node ? 'pointer' : 'default';
          }
        }}
        d3VelocityDecay={0.3}
        cooldownTicks={isPathMode ? 50 : 200}
        onEngineStop={() => {
          if (graphRef.current && !selectedNodeId) {
            graphRef.current.zoomToFit(800, 50);
          }
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const activeNode = hoverNode || selectedNodeId;
          const isSelected = node.id === selectedNodeId;
          const isHovered = node.id === hoverNode;
          const isActive = isSelected || isHovered;
          const isNeighbor = neighborIds.has(node.id);
          const isFaded = activeNode && !isActive && !isNeighbor;
          
          const label = node.name || '';
          const fontSize = isActive ? 14/globalScale : 11/globalScale;
          
          ctx.save();
          ctx.globalAlpha = isFaded ? 0.2 : 1;
          
          // Draw Glow
          if (isActive) {
            ctx.shadowColor = node.color || '#888';
            ctx.shadowBlur = 20 * globalScale;
          } else {
            ctx.shadowBlur = 0;
          }
          
          // Draw Node Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, isActive ? 8 : 6, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || '#888';
          ctx.fill();
          
          // Draw Border
          ctx.strokeStyle = isActive ? '#ffffff' : '#1a1a1a';
          ctx.lineWidth = isActive ? 2 / globalScale : 1 / globalScale;
          ctx.stroke();
          
          // Reset shadow for text
          ctx.shadowBlur = 0;
          
          // Draw Label
          if (globalScale > 1.2 || isActive) {
            ctx.font = `${isActive ? 'bold' : 'normal'} ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Text background pill for readability
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);
            const textY = node.y + (isActive ? 14 : 10);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.roundRect(
              node.x - bckgDimensions[0] / 2, 
              textY - bckgDimensions[1] / 2, 
              bckgDimensions[0], 
              bckgDimensions[1], 
              4
            );
            ctx.fill();
            
            // Text
            ctx.fillStyle = isActive ? '#ffffff' : '#e5e7eb';
            ctx.fillText(label, node.x, textY);
          }
          ctx.restore();
        }}
      />
    </div>
  );
}
