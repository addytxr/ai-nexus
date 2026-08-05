import { NextResponse } from 'next/server';
import { getDriver } from '@/lib/db/neo4j';

export async function GET() {
  try {
    const driver = getDriver();
    const session = driver.session();
    
    const result = await session.run(`
      MATCH (n)
      WITH count(n) AS totalNodes
      MATCH ()-[r]->()
      RETURN totalNodes, count(r) AS totalEdges
    `);
    
    await session.close();

    const stats = {
      nodes: result.records[0].get('totalNodes').toInt(),
      relationships: result.records[0].get('totalEdges').toInt(),
    };

    return NextResponse.json({ status: 'ok', data: stats }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
