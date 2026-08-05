'use client';

import { Search, Network, Moon, Sun, GitBranch, Map } from 'lucide-react';
import { useGraph } from '@/lib/store/graph-context';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export function TopNav() {
  const { setSearchOpen, isPathMode, setIsPathMode } = useGraph();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0 flex items-center justify-between px-4 md:px-6 z-40 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 p-1.5 bg-primary/10 rounded-md ring-1 ring-primary/20">
          <Network className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">AI Nexus</span>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
        <button
          onClick={() => setIsPathMode(false)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            !isPathMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          Explore
        </button>
        <button
          onClick={() => setIsPathMode(true)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            isPathMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          Path Explorer
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          className="hidden md:flex w-64 justify-between text-muted-foreground bg-muted/30 border-border/50 hover:bg-accent hover:text-accent-foreground h-8 px-3 transition-colors shadow-sm"
          onClick={() => setSearchOpen(true)}
        >
          <span className="text-xs font-normal">Search the graph...</span>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-background/50 px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-8 w-8"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-4 bg-border/50 hidden md:block mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
