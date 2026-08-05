'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Database, Search } from 'lucide-react';
import { useGraph } from '@/lib/store/graph-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/graph/stats').then(r => r.json())
  });
  const { setSearchOpen } = useGraph();

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-12 lg:p-24 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-primary/10 rounded-2xl mb-2">
            <Network className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">The AI Knowledge Graph</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore the interconnected ecosystem of AI models, tools, frameworks, and companies powering the next generation of software.
          </p>
          <div className="pt-4 flex gap-4">
            <Button size="lg" onClick={() => setSearchOpen(true)} className="gap-2 px-8 rounded-full shadow-lg">
              <Search className="w-4 h-4" /> Search the Graph
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl bg-card" />)}
          </div>
        ) : data?.data ? (
          <div className="space-y-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/40 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Entities</CardTitle>
                  <Database className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.data.totalNodes}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/40 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Connections</CardTitle>
                  <Network className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.data.totalRelationships}</div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mt-12 mb-4">Ecosystem Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(data.data.labels).map(([label, count]) => (
                <Card key={label} className="bg-card/20 border-border/30 hover:bg-card/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count as number}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 mt-12">Failed to load graph stats.</div>
        )}
      </div>
    </div>
  );
}
