'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-12 lg:p-24 bg-background relative selection:bg-primary/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-12 relative z-10">
        <motion.div variants={item} className="flex flex-col items-center text-center space-y-5">
          <div className="p-3 bg-primary/10 rounded-2xl mb-2 shadow-inner ring-1 ring-primary/20">
            <Network className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            The AI Knowledge Graph
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Explore the interconnected ecosystem of AI models, tools, frameworks, and companies powering the next generation of software.
          </p>
          <div className="pt-6 flex gap-4">
            <Button size="lg" onClick={() => setSearchOpen(true)} className="gap-2 px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all text-base h-12">
              <Search className="w-5 h-5" /> Search the Graph
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-card border border-border/50" />)}
          </motion.div>
        ) : data?.data ? (
          <div className="space-y-10 mt-16">
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/40 border-border/60 shadow-sm backdrop-blur-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Entities</CardTitle>
                  <Database className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold tracking-tight">{data.data.totalNodes}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/40 border-border/60 shadow-sm backdrop-blur-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Connections</CardTitle>
                  <Network className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold tracking-tight">{data.data.totalRelationships}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Network className="w-5 h-5 text-primary" /> Ecosystem Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(data.data.labels).map(([label, count]) => (
                  <Card key={label} className="bg-card/20 border-border/40 hover:bg-card/60 transition-all hover:-translate-y-0.5 rounded-xl cursor-default shadow-sm">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{count as number}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div variants={item} className="text-center text-red-500 mt-12 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            Failed to load graph stats.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
