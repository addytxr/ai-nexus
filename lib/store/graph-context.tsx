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
}

const GraphContext = createContext<GraphState | undefined>(undefined);

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [graphDepth, setGraphDepth] = useState<number>(1);
  const [shortestPath, setShortestPath] = useState<{ source: string; target: string } | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [isPathMode, setIsPathMode] = useState<boolean>(false);

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
