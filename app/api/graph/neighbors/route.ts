import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGraphNeighbors, checkNodeExists } from '@/lib/services/graph';

const schema = z.object({
  nodeId: z.string().min(1, 'nodeId is required'),
  depth: z.coerce.number().int().min(1).max(3).default(1),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = schema.safeParse({ 
      nodeId: url.searchParams.get('nodeId'),
      depth: url.searchParams.get('depth') || undefined
    });
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { nodeId, depth } = parsed.data;

    const exists = await checkNodeExists(nodeId);
    if (!exists) {
      return NextResponse.json({ error: 'Start node not found' }, { status: 404 });
    }

    const results = await getGraphNeighbors(nodeId, depth);
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: unknown) {
    console.error('Neighbors API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
