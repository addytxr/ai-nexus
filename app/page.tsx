export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-14 border-b flex items-center px-6 justify-between bg-background z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            AI
          </div>
          <span className="font-semibold text-sm tracking-tight">Nexus</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Graph Explorer
        </div>
      </header>
      <main className="flex-1 relative bg-zinc-950/50">
        {/* Graph visualization will go here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Interactive Graph Canvas (Placeholder)</p>
        </div>
      </main>
    </div>
  );
}
