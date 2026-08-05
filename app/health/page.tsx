'use client';

import { useEffect, useState } from 'react';

export default function HealthPage() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setStatus(`Status: ${data.status} | DB: ${data.database}`);
        } else {
          setStatus('Failed to connect to Health API.');
        }
      } catch {
        setStatus('Error checking health status.');
      }
    }

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="p-8 border border-border rounded-xl bg-card shadow-2xl flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">AI Nexus Health</h1>
        <div className="px-4 py-2 rounded bg-muted font-mono text-sm">
          {status}
        </div>
      </div>
    </div>
  );
}
