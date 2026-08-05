import { NextResponse } from 'next/server';
import { getGraphStats } from '@/lib/services/graph';

export async function GET() {
  try {
    const stats = await getGraphStats();
    return NextResponse.json({ data: stats }, { status: 200 });
  } catch (error: unknown) {
    console.error('Graph Stats API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
