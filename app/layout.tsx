import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { GraphProvider } from '@/lib/store/graph-context';
import { TopNav } from '@/components/layout/top-nav';
import { GlobalSearch } from '@/components/search/global-search';
import { ReactQueryProvider } from '@/lib/store/query-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Nexus',
  description: 'The definitive knowledge graph of the AI ecosystem.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ReactQueryProvider>
            <GraphProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/20">
              <div className="flex flex-col flex-1 overflow-hidden relative">
                <TopNav />
                <main className="flex-1 overflow-hidden relative">
                  {children}
                </main>
              </div>
              <GlobalSearch />
            </div>
          </GraphProvider>
        </ReactQueryProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
