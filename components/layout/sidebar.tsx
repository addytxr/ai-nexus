'use client';


import { Network, Search, GitBranch } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useGraph } from '@/lib/store/graph-context';

export function Sidebar() {
  const pathname = usePathname();
  const { setSearchOpen, isPathMode, setIsPathMode, setSelectedNodeId } = useGraph();

  return (
    <div className="w-16 md:w-64 border-r bg-card/50 flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="h-14 flex items-center justify-center md:justify-start md:px-6 border-b shrink-0 bg-background/50">
        <Network className="w-6 h-6 text-primary" />
        <span className="ml-3 font-semibold text-lg hidden md:block">AI Nexus</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-2 md:px-4">
        <button
          onClick={() => { setIsPathMode(false); setSelectedNodeId(null); }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left",
            !isPathMode && pathname === '/' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Network className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Graph Explorer</span>
        </button>
        
        <button 
          onClick={() => { setIsPathMode(true); setSelectedNodeId(null); }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left",
            isPathMode ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <GitBranch className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Path Explorer</span>
        </button>

        <button 
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
        >
          <Search className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Search Entities</span>
        </button>
      </nav>
      
      <div className="p-4 border-t hidden md:block">
        <div className="text-xs text-muted-foreground">v0.1.0</div>
      </div>
    </div>
  );
}
