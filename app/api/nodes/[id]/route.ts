import { NextRequest, NextResponse } from 'next/server';
import { getNodeDetails } from '@/lib/services/graph';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const details = await getNodeDetails(id);
    if (!details) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: details }, { status: 200 });
  } catch (error: unknown) {
    console.error('Node Details API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
