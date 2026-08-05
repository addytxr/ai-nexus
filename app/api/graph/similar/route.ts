import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSimilarTools, checkNodeExists } from '@/lib/services/graph';

const schema = z.object({
  nodeId: z.string().min(1, 'nodeId is required'),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = schema.safeParse({ 
      nodeId: url.searchParams.get('nodeId')
    });
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { nodeId } = parsed.data;

    const exists = await checkNodeExists(nodeId);
    if (!exists) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    const results = await getSimilarTools(nodeId);
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: unknown) {
    console.error('Similar Tools API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
