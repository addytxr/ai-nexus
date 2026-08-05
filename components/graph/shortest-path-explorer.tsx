'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Target, GitBranch, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

// Custom Search Combobox
function NodeSelector({ value, onSelect, placeholder }: { value: string | null, onSelect: (id: string, name: string) => void, placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
    enabled: query.length > 0
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground font-normal truncate text-left focus:outline-none focus:ring-1 focus:ring-ring">
        {value ? name : <span className="text-muted-foreground">{placeholder}</span>}
        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 shadow-xl" align="start">
        <Command>
          <CommandInput placeholder="Search node..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-48">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data?.data?.map((node: any) => (
                  <CommandItem
                    key={node.id}
                    value={node.name}
                    onSelect={() => {
                      setName(node.name);
                      onSelect(node.id, node.name);
                      setOpen(false);
                    }}
                  >
                    {node.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ShortestPathExplorer() {
  const { shortestPath, setShortestPath } = useGraph();
  const [source, setSource] = useState<string | null>(shortestPath?.source || null);
  const [target, setTarget] = useState<string | null>(shortestPath?.target || null);

  const handleExplore = () => {
    if (source && target) {
      setShortestPath({ source, target });
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['path', shortestPath?.source, shortestPath?.target],
    queryFn: () => fetch(`/api/graph/path?source=${shortestPath!.source}&target=${shortestPath!.target}`).then(r => r.json()),
    enabled: !!shortestPath
  });

  return (
    <Card className="absolute top-6 left-6 z-10 w-[380px] shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          Path Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <NodeSelector value={source} onSelect={setSource} placeholder="Select starting node..." />
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-green-500 shrink-0" />
            <NodeSelector value={target} onSelect={setTarget} placeholder="Select target node..." />
          </div>
        </div>

        <Button 
          className="w-full" 
          disabled={!source || !target || (source === target)} 
          onClick={handleExplore}
        >
          Find Shortest Path
        </Button>

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {data?.error && (
          <div className="text-sm text-red-500 p-3 bg-red-500/10 rounded-md font-medium text-center">
            {data.error}
          </div>
        )}

        {data?.data && (
          <div className="mt-4 space-y-3 pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold mb-3">Path Timeline</h4>
            <ScrollArea className="h-64 pr-3">
              <div className="flex flex-col">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data.data.nodes.map((node: any, idx: number) => (
                  <div key={`node-${idx}`} className="flex flex-col w-full">
                    
                    {/* Node Card */}
                    <div className="w-full bg-card/40 p-3.5 rounded-xl border border-border/50 shadow-sm flex items-center justify-between group hover:bg-card/80 transition-colors cursor-default">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{node.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded-md">{node.label}</span>
                    </div>
                    
                    {/* Edge */}
                    {idx < data.data.edges.length && (
                      <div className="flex flex-col items-center my-1 relative">
                        <div className="w-px h-6 bg-gradient-to-b from-border to-border/30" />
                        <div className="absolute top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-muted-foreground bg-background px-2 py-1 rounded-full border border-border/50 uppercase tracking-widest shadow-sm z-10 whitespace-nowrap">
                          {data.data.edges[idx].type.replace(/_/g, ' ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
