import { getDriver } from '@/lib/db/neo4j';

export async function searchNodes(query: string) {
  const session = getDriver().session();
  try {
    const cypher = `
      MATCH (n)
      WITH n,
           CASE 
             WHEN toLower(n.name) = toLower($query) THEN 1
             WHEN toLower(n.name) STARTS WITH toLower($query) THEN 2
             WHEN toLower(n.name) CONTAINS toLower($query) THEN 3
             WHEN toLower(n.description) CONTAINS toLower($query) THEN 4
             ELSE 5
           END AS rank
      WHERE rank <= 4
      RETURN n.id AS id, 
             labels(n)[0] AS label, 
             n.name AS name, 
             n.description AS description, 
             n.icon AS icon, 
             n.color AS color, 
             n.logoUrl AS logoUrl,
             rank
      ORDER BY rank ASC, n.name ASC
      LIMIT 20
    `;
    const res = await session.run(cypher, { query });
    return res.records.map(r => ({
      id: r.get('id'),
      label: r.get('label'),
      name: r.get('name'),
      description: r.get('description'),
      icon: r.get('icon'),
      color: r.get('color'),
      logoUrl: r.get('logoUrl'),
    }));
  } finally {
    await session.close();
  }
}

export async function getNodeDetails(id: string) {
  const session = getDriver().session();
  try {
    const cypher = `
      MATCH (n {id: $id})
      OPTIONAL MATCH (n)-[outgoing]->(target)
      WITH n, collect(DISTINCT {type: type(outgoing), target: target, reason: outgoing.reason}) AS outgoingEdges
      OPTIONAL MATCH (source)-[incoming]->(n)
      WITH n, outgoingEdges, collect(DISTINCT {type: type(incoming), source: source, reason: incoming.reason}) AS incomingEdges
      RETURN n, outgoingEdges, incomingEdges
    `;
    const res = await session.run(cypher, { id });
    if (res.records.length === 0) return null;
    
    const r = res.records[0];
    const n = r.get('n');
    if (!n) return null;

    return {
      node: { label: n.labels[0], ...n.properties },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      outgoing: r.get('outgoingEdges').filter((e: any) => e.type !== null).map((e: any) => ({
        type: e.type,
        reason: e.reason,
        target: { label: e.target.labels?.[0], ...e.target.properties }
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      incoming: r.get('incomingEdges').filter((e: any) => e.type !== null).map((e: any) => ({
        type: e.type,
        reason: e.reason,
        source: { label: e.source.labels?.[0], ...e.source.properties }
      }))
    };
  } finally {
    await session.close();
  }
}

export async function getGraphNeighbors(id: string, depth: number) {
  const session = getDriver().session();
  try {
    const cypher = `
      MATCH path = (start {id: $id})-[*1..${depth}]-(neighbor)
      UNWIND nodes(path) AS n
      UNWIND relationships(path) AS r
      RETURN collect(DISTINCT n) AS nodes, 
             collect(DISTINCT {
               type: type(r),
               reason: r.reason,
               source: startNode(r).id,
               target: endNode(r).id
             }) AS edges
    `;
    const res = await session.run(cypher, { id });
    if (res.records.length === 0) return { nodes: [], edges: [] };
    
    const r = res.records[0];
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: r.get('nodes').map((n: any) => ({ label: n.labels[0], ...n.properties })),
      edges: r.get('edges')
    };
  } finally {
    await session.close();
  }
}

export async function getShortestPath(sourceId: string, targetId: string) {
  const session = getDriver().session();
  try {
    const cypher = `
      MATCH path = shortestPath((source {id: $sourceId})-[*..6]-(target {id: $targetId}))
      RETURN [node in nodes(path) | node] AS nodes,
             [rel in relationships(path) | {
               type: type(rel),
               reason: rel.reason,
               source: startNode(rel).id,
               target: endNode(rel).id
             }] AS edges,
             [rel in relationships(path) | rel.reason] AS explanation
    `;
    const res = await session.run(cypher, { sourceId, targetId });
    if (res.records.length === 0) return null;
    
    const r = res.records[0];
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: r.get('nodes').map((n: any) => ({ label: n.labels[0], ...n.properties })),
      edges: r.get('edges'),
      explanation: r.get('explanation')
    };
  } finally {
    await session.close();
  }
}

export async function getSimilarTools(id: string) {
  const session = getDriver().session();
  try {
    const cypher = `
      MATCH (t1:Tool {id: $id})-[:USES|INTEGRATES_WITH]->(shared)<-[:USES|INTEGRATES_WITH]-(t2:Tool)
      WHERE t1 <> t2
      RETURN t2.id AS id, t2.name AS name, t2.logoUrl AS logoUrl, t2.description AS description, count(shared) AS score
      ORDER BY score DESC
      LIMIT 5
    `;
    const res = await session.run(cypher, { id });
    return res.records.map(r => ({
      id: r.get('id'),
      name: r.get('name'),
      description: r.get('description'),
      logoUrl: r.get('logoUrl'),
      score: r.get('score').toInt()
    }));
  } finally {
    await session.close();
  }
}

export async function checkNodeExists(id: string): Promise<boolean> {
  const session = getDriver().session();
  try {
    const res = await session.run('MATCH (n {id: $id}) RETURN count(n) > 0 AS exists', { id });
    return res.records[0].get('exists');
  } finally {
    await session.close();
  }
}

export async function getGraphStats() {
  const session = getDriver().session();
  try {
    const cypher = `
      MATCH (n)
      WITH labels(n)[0] AS label, count(n) AS count
      WITH collect({label: label, count: count}) AS labelCounts
      MATCH (n) WITH count(n) AS totalNodes, labelCounts
      MATCH ()-[r]->() RETURN totalNodes, count(r) AS totalEdges, labelCounts
    `;
    const res = await session.run(cypher);
    const r = res.records[0];
    
    const labelCountsArray = r.get('labelCounts');
    const labelsMap: Record<string, number> = {};
    for (const item of labelCountsArray) {
      if (item.label) labelsMap[item.label] = item.count.toInt();
    }

    return {
      totalNodes: r.get('totalNodes').toInt(),
      totalRelationships: r.get('totalEdges').toInt(),
      labels: labelsMap
    };
  } finally {
    await session.close();
  }
}
