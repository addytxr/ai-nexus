'use client';

import { useState } from 'react';
import { Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodeLogoProps {
  logoUrl?: string | null;
  websiteUrl?: string | null;
  className?: string;
  fallbackIconClassName?: string;
  containerClassName?: string;
}

export function NodeLogo({ logoUrl, websiteUrl, className, fallbackIconClassName, containerClassName }: NodeLogoProps) {
  const [error, setError] = useState(false);

  // Helper to extract domain for Clearbit API
  const getDomain = (url?: string | null) => {
    if (!url) return null;
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  };

  const domain = getDomain(websiteUrl);
  const finalLogoUrl = logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : null);

  return (
    <div className={cn("flex items-center justify-center shrink-0 overflow-hidden bg-background", containerClassName)}>
      {!error && finalLogoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={finalLogoUrl} 
          alt="" 
          className={cn("w-full h-full object-contain", className)} 
          onError={() => setError(true)} 
        />
      ) : (
        <Network className={cn("text-muted-foreground/50", fallbackIconClassName)} />
      )}
    </div>
  );
}
