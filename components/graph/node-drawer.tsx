'use client';

import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, ArrowLeft, Network } from 'lucide-react';
import { SimilarTools } from './similar-tools';

export function NodeDrawer() {
  const { selectedNodeId, setSelectedNodeId } = useGraph();

  const { data, isLoading } = useQuery({
    queryKey: ['node', selectedNodeId],
    queryFn: () => fetch(`/api/nodes/${selectedNodeId}`).then(r => r.json()),
    enabled: !!selectedNodeId
  });

  const node = data?.data?.node;
  const incoming = data?.data?.incoming || [];
  const outgoing = data?.data?.outgoing || [];

  return (
    <Sheet open={!!selectedNodeId} onOpenChange={(open) => !open && setSelectedNodeId(null)}>
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
                <SheetHeader className="text-left space-y-5">
                  <div className="flex items-start gap-4">
                    {node.logoUrl ? (
                      <div className="w-16 h-16 rounded-2xl border border-border/60 flex items-center justify-center p-3 bg-card shadow-sm shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={node.logoUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl border border-border/60 flex items-center justify-center bg-card shadow-sm shrink-0">
                        <Network className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex flex-col pt-1">
                      <Badge variant="secondary" className="w-fit mb-2 font-mono text-[10px] bg-secondary/50">{node.label}</Badge>
                      <SheetTitle className="text-3xl font-bold tracking-tight">{node.name}</SheetTitle>
                    </div>
                  </div>
                  {node.description && (
                    <SheetDescription className="text-base text-muted-foreground/90 leading-relaxed">
                      {node.description}
                    </SheetDescription>
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
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                      <ArrowRight className="w-4 h-4 text-emerald-500" /> Outgoing ({outgoing.length})
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {outgoing.map((e: any, i: number) => (
                        <div key={i} className="group text-sm p-3.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all cursor-pointer shadow-sm" onClick={() => setSelectedNodeId(e.target.id)}>
                          <div className="flex items-center justify-between mb-1.5">
                            <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-600 bg-emerald-500/5 font-semibold px-2">{e.type}</Badge>
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{e.target.name}</span>
                          </div>
                          {e.reason && <p className="text-xs text-muted-foreground leading-relaxed">{e.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {incoming.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                      <ArrowLeft className="w-4 h-4 text-blue-500" /> Incoming ({incoming.length})
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {incoming.map((e: any, i: number) => (
                        <div key={i} className="group text-sm p-3.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all cursor-pointer shadow-sm" onClick={() => setSelectedNodeId(e.source.id)}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{e.source.name}</span>
                            <Badge variant="outline" className="text-[10px] border-blue-500/20 text-blue-600 bg-blue-500/5 font-semibold px-2">{e.type}</Badge>
                          </div>
                          {e.reason && <p className="text-xs text-muted-foreground leading-relaxed">{e.reason}</p>}
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
