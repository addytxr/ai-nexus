import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchNodes } from '@/lib/services/graph';

const searchSchema = z.object({
  q: z.string().min(1, 'Query is required'),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = searchSchema.safeParse({ q: url.searchParams.get('q') });
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const results = await searchNodes(parsed.data.q);
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: unknown) {
    console.error('Search API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
