'use client';

import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
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
                <SheetHeader className="text-left space-y-4">
                  <div className="flex items-center gap-4">
                    {node.logoUrl && (
                      <div className="w-12 h-12 rounded-xl border flex items-center justify-center p-2 bg-muted/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={node.logoUrl} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div>
                      <SheetTitle className="text-2xl">{node.name}</SheetTitle>
                      <Badge variant="secondary" className="mt-1 font-mono text-[10px]">{node.label}</Badge>
                    </div>
                  </div>
                  {node.description && (
                    <SheetDescription className="text-base text-muted-foreground/90">
                      {node.description}
                    </SheetDescription>
                  )}
                </SheetHeader>

                {node.websiteUrl && (
                  <a 
                    href={node.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="w-4 h-4" /> Visit Website
                  </a>
                )}

                <Separator />

                {outgoing.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-500" /> Outgoing ({outgoing.length})
                    </h4>
                    <div className="flex flex-col gap-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {outgoing.map((e: any, i: number) => (
                        <div key={i} className="text-sm p-3 rounded-lg border bg-muted/30 hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => setSelectedNodeId(e.target.id)}>
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500">{e.type}</Badge>
                            <span className="font-medium text-foreground">{e.target.name}</span>
                          </div>
                          {e.reason && <p className="text-xs text-muted-foreground mt-1.5">{e.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {incoming.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-blue-500" /> Incoming ({incoming.length})
                    </h4>
                    <div className="flex flex-col gap-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {incoming.map((e: any, i: number) => (
                        <div key={i} className="text-sm p-3 rounded-lg border bg-muted/30 hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => setSelectedNodeId(e.source.id)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground">{e.source.name}</span>
                            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500">{e.type}</Badge>
                          </div>
                          {e.reason && <p className="text-xs text-muted-foreground mt-1.5">{e.reason}</p>}
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
