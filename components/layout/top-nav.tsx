'use client';

import { Search, Map } from 'lucide-react';
import { useGraph } from '@/lib/store/graph-context';
import { Button } from '@/components/ui/button';

export function TopNav() {
  const { setSearchOpen } = useGraph();

  return (
    <header className="h-14 border-b bg-background/80 backdrop-blur-md shrink-0 flex items-center justify-between px-4 md:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Map className="w-4 h-4" />
          <span>Knowledge Graph</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="hidden md:flex w-64 justify-between text-muted-foreground bg-muted/50 border-muted-foreground/20 hover:bg-muted/80"
          onClick={() => setSearchOpen(true)}
        >
          <span>Search the graph...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
