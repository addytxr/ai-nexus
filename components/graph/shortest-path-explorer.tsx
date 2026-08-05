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
            <h4 className="text-sm font-semibold">Path Explanation</h4>
            <ScrollArea className="h-48">
              <div className="text-sm space-y-2 pr-4">
                {data.data.explanation.map((exp: string, idx: number) => (
                  <div key={idx} className="flex gap-3 text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/30 shadow-sm">
                    <span className="shrink-0 font-mono text-[10px] font-bold bg-primary text-primary-foreground w-4 h-4 flex items-center justify-center rounded mt-0.5">{idx + 1}</span>
                    <span className="leading-snug">{exp}</span>
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
