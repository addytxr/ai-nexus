'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Loader2, Sparkles } from 'lucide-react';
import { NodeLogo } from '@/components/ui/node-logo';

const SUGGESTIONS = [
  { id: '7dea3224-032a-4694-ae51-c02aa867b48e', name: 'Cursor', label: 'Tool', description: 'AI-first code editor.' },
  { id: '31d60832-67b6-4be9-9355-7f908f465377', name: 'Claude 3.5 Sonnet', label: 'Model', description: 'Most intelligent model by Anthropic.' },
  { id: '28745d0c-5f66-4d2b-996c-2933157c10d5', name: 'GPT-4o', label: 'Model', description: 'Fast, multimodal model from OpenAI.' },
  { id: '5528b810-4d25-45fe-88b7-1e6186fc9c2b', name: 'LangChain', label: 'Framework', description: 'Framework for LLM apps.' },
  { id: 'd0670952-32e2-4169-863e-66a2d785861a', name: 'OpenAI', label: 'Company', description: 'AI research and deployment company.' },
  { id: '4db2bdd0-ae22-4b48-92a0-a4dfaaf082a6', name: 'Anthropic', label: 'Company', description: 'AI safety and research company.' },
];

export function GlobalSearch() {
  const { searchOpen, setSearchOpen, setSelectedNodeId, setDrawerOpen } = useGraph();
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
    setDrawerOpen(true);
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
        <CommandList className="max-h-[60vh] overflow-y-auto">
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center p-6 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching the knowledge graph...
              </div>
            ) : query.length > 0 ? (
              "No results found."
            ) : null}
          </CommandEmpty>
          
          {!debouncedQuery && (
            <CommandGroup heading="Suggested">
              {SUGGESTIONS.map(node => (
                <CommandItem 
                  key={node.id} 
                  value={node.name}
                  onSelect={() => onSelectNode(node.id)}
                  className="flex items-center gap-3 py-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border/40 shadow-sm group-hover:border-primary/50 transition-colors">
                    <Sparkles className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{node.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{node.description}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/50 group-hover:text-muted-foreground/80">{node.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {debouncedQuery && groupedResults && Object.keys(groupedResults).length > 0 && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(groupedResults).map(([label, nodes]: [string, any], idx) => (
            <div key={label}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={label}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {nodes.map((node: any) => (
                  <CommandItem 
                    key={node.id} 
                    value={node.name}
                    onSelect={() => onSelectNode(node.id)}
                    className="flex items-center gap-3 py-3 cursor-pointer group"
                  >
                    <NodeLogo 
                      logoUrl={node.logoUrl} 
                      websiteUrl={node.websiteUrl}
                      containerClassName="w-8 h-8 rounded-lg border border-border/40 shadow-sm group-hover:border-primary/50 transition-colors"
                      fallbackIconClassName="w-4 h-4 group-hover:text-primary transition-colors"
                      className="rounded-sm p-1"
                    />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">{node.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{node.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))
        )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
