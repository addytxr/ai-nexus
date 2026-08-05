'use client';

import React, { createContext, useContext, useState } from 'react';

interface GraphState {
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  graphDepth: number;
  setGraphDepth: (depth: number) => void;
  shortestPath: { source: string; target: string } | null;
  setShortestPath: (path: { source: string; target: string } | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isPathMode: boolean;
  setIsPathMode: (mode: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const GraphContext = createContext<GraphState | undefined>(undefined);

export function GraphProvider({ children }: { children: React.ReactNode }) {
  // Default to OpenAI (d0670952-32e2-4169-863e-66a2d785861a) to show a rich curated graph on first load
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('d0670952-32e2-4169-863e-66a2d785861a');
  const [graphDepth, setGraphDepth] = useState<number>(2);
  const [shortestPath, setShortestPath] = useState<{ source: string; target: string } | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [isPathMode, setIsPathMode] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <GraphContext.Provider
      value={{
        selectedNodeId,
        setSelectedNodeId,
        graphDepth,
        setGraphDepth,
        shortestPath,
        setShortestPath,
        searchOpen,
        setSearchOpen,
        isPathMode,
        setIsPathMode,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
