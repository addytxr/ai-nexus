'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Network, Loader2 } from 'lucide-react';

export function GlobalSearch() {
  const { searchOpen, setSearchOpen, setSelectedNodeId } = useGraph();
  const [query, setQuery] = useState('');
  
  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`).then(r => r.json()),
    enabled: debouncedQuery.length > 0
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedResults = data?.data?.reduce((acc: any, node: any) => {
    if (!acc[node.label]) acc[node.label] = [];
    acc[node.label].push(node);
    return acc;
  }, {});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setSearchOpen]);

  const onSelectNode = (id: string) => {
    setSearchOpen(false);
    setSelectedNodeId(id);
    setQuery('');
  };

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <Command>
        <CommandInput 
          placeholder="Search for models, tools, companies..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center p-6 text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </div>
            ) : query.length > 0 ? (
              "No results found."
            ) : (
              "Type to search..."
            )}
          </CommandEmpty>
          
          {groupedResults && Object.keys(groupedResults).length > 0 && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(groupedResults).map(([label, nodes]: [string, any]) => (
            <CommandGroup key={label} heading={label}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {nodes.map((node: any) => (
                <CommandItem 
                  key={node.id} 
                  value={node.name}
                  onSelect={() => onSelectNode(node.id)}
                  className="flex items-center gap-3 py-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border/40 shadow-sm group-hover:border-primary/50 transition-colors">
                    {node.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={node.logoUrl} alt="" className="w-5 h-5 rounded-sm object-contain" />
                    ) : (
                      <Network className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">{node.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{node.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))
        )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
