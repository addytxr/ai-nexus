import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getShortestPath, checkNodeExists } from '@/lib/services/graph';

const schema = z.object({
  source: z.string().min(1, 'source is required'),
  target: z.string().min(1, 'target is required'),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = schema.safeParse({ 
      source: url.searchParams.get('source'),
      target: url.searchParams.get('target')
    });
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { source, target } = parsed.data;

    const [sourceExists, targetExists] = await Promise.all([
      checkNodeExists(source),
      checkNodeExists(target)
    ]);

    if (!sourceExists) return NextResponse.json({ error: 'Source node not found' }, { status: 404 });
    if (!targetExists) return NextResponse.json({ error: 'Target node not found' }, { status: 404 });

    const results = await getShortestPath(source, target);
    if (!results) {
      return NextResponse.json({ error: 'No path exists between these nodes' }, { status: 404 });
    }
    
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: unknown) {
    console.error('Path API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
