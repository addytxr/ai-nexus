'use client';

import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ArrowRight, ArrowLeft, Network } from 'lucide-react';
import { SimilarTools } from './similar-tools';

export function NodeDrawer() {
  const { selectedNodeId, setSelectedNodeId, drawerOpen, setDrawerOpen } = useGraph();

  const { data, isLoading } = useQuery({
    queryKey: ['node', selectedNodeId],
    queryFn: () => fetch(`/api/nodes/${selectedNodeId}`).then(r => r.json()),
    enabled: !!selectedNodeId
  });

  const node = data?.data?.node;
  const incoming = data?.data?.incoming || [];
  const outgoing = data?.data?.outgoing || [];

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <ScrollArea className="flex-1 h-full">
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                <div className="h-24 bg-muted rounded animate-pulse" />
              </div>
            ) : node ? (
              <div className="space-y-6">
                <SheetHeader className="text-left space-y-6">
                  <div className="flex items-center gap-4">
                    {node.logoUrl ? (
                      <div className="w-14 h-14 rounded-xl border border-border/40 flex items-center justify-center p-2.5 bg-background shadow-sm shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={node.logoUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl border border-border/40 flex items-center justify-center bg-background shadow-sm shrink-0">
                        <Network className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70 mb-1.5">{node.label}</span>
                      <SheetTitle className="text-2xl font-semibold tracking-tight leading-none">{node.name}</SheetTitle>
                    </div>
                  </div>
                  
                  {node.description && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Overview</h4>
                      <SheetDescription className="text-sm text-foreground/80 leading-relaxed">
                        {node.description}
                      </SheetDescription>
                    </div>
                  )}
                </SheetHeader>

                {node.websiteUrl && (
                  <a href={node.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-start gap-2 h-10 px-4 py-2 w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
                    <ExternalLink className="w-4 h-4 text-primary" /> 
                    <span className="text-foreground">Official Website</span>
                  </a>
                )}

                <Separator />

                {outgoing.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500/70" /> Outgoing Dependencies
                    </h4>
                    <div className="flex flex-col gap-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {outgoing.map((e: any, i: number) => (
                        <div key={i} className="group text-sm p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card hover:border-border/80 transition-all cursor-pointer shadow-sm" onClick={() => setSelectedNodeId(e.target.id)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{e.type.replace(/_/g, ' ')}</span>
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{e.target.name}</span>
                          </div>
                          {e.reason && <p className="text-xs text-muted-foreground/80 leading-relaxed">{e.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {incoming.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                      <ArrowLeft className="w-3.5 h-3.5 text-blue-500/70" /> Incoming Dependencies
                    </h4>
                    <div className="flex flex-col gap-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {incoming.map((e: any, i: number) => (
                        <div key={i} className="group text-sm p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card hover:border-border/80 transition-all cursor-pointer shadow-sm" onClick={() => setSelectedNodeId(e.source.id)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{e.source.name}</span>
                            <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{e.type.replace(/_/g, ' ')}</span>
                          </div>
                          {e.reason && <p className="text-xs text-muted-foreground/80 leading-relaxed">{e.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />
                <SimilarTools nodeId={selectedNodeId!} />
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
