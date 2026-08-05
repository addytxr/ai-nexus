'use client';
import { useQuery } from '@tanstack/react-query';
import { useGraph } from '@/lib/store/graph-context';
import { NodeLogo } from '@/components/ui/node-logo';

export function SimilarTools({ nodeId }: { nodeId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['similar', nodeId],
    queryFn: () => fetch(`/api/graph/similar?nodeId=${nodeId}`).then(r => r.json()),
    enabled: !!nodeId
  });
  const { setSelectedNodeId } = useGraph();

  if (isLoading) return <div className="h-20 bg-muted animate-pulse rounded-lg" />;
  if (!data?.data || data.data.length === 0) return null;

  return (
    <div className="space-y-3 pt-2 pb-6">
      <h4 className="text-sm font-semibold">Similar Tools</h4>
      <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {data.data.map((tool: any) => (
          <div 
            key={tool.id} 
            onClick={() => setSelectedNodeId(tool.id)}
            className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
          >
            <NodeLogo 
              logoUrl={tool.logoUrl} 
              websiteUrl={tool.websiteUrl}
              containerClassName="w-8 h-8 rounded-md border border-border/50 shrink-0"
              fallbackIconClassName="w-4 h-4"
              className="rounded-sm p-1"
            />
            <div className="flex flex-col flex-1">
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{tool.name}</span>
              <span className="text-xs text-muted-foreground">{tool.score} shared connections</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
