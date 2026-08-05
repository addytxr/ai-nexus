import { NextResponse } from 'next/server';
import { getDriver } from '@/lib/db/neo4j';

export async function GET() {
  try {
    const driver = getDriver();
    const session = driver.session();
    
    // Test connectivity
    const result = await session.run('RETURN 1 AS num');
    await session.close();

    const isConnected = result.records[0].get('num').toInt() === 1;

    if (isConnected) {
      return NextResponse.json({ status: 'ok', database: 'connected' }, { status: 200 });
    }
    
    return NextResponse.json({ status: 'error', database: 'disconnected' }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
