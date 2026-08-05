import fs from 'fs';
import path from 'path';
import { getDriver, closeDriver } from '../lib/db/neo4j';

async function seed() {
  const dataPath = path.join(process.cwd(), 'data', 'seed.json');
  if (!fs.existsSync(dataPath)) {
    console.error('seed.json not found at', dataPath);
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  const driver = getDriver();
  const session = driver.session();
  
  try {
    console.log('Creating constraints...');
    const nodeLabels = new Set<string>(seedData.nodes.map((n: { label: string }) => n.label));
    
    for (const label of nodeLabels) {
      await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`);
    }
    console.log('Constraints created successfully.');

    console.log(`Importing ${seedData.nodes.length} nodes...`);
    let nodeCount = 0;
    for (const node of seedData.nodes) {
      const { id, label, ...properties } = node;
      await session.run(
        `MERGE (n:${label} {id: $id}) SET n += $properties`,
        { id, properties }
      );
      nodeCount++;
      if (nodeCount % 50 === 0) console.log(`...imported ${nodeCount} nodes`);
    }
    console.log(`Finished importing ${nodeCount} nodes.`);

    console.log(`Importing ${seedData.edges.length} edges...`);
    let edgeCount = 0;
    for (const edge of seedData.edges) {
      const { source, target, type, ...properties } = edge;
      // Note: MERGE on relationships without specifying constraints or fully qualified nodes can be tricky,
      // but since nodes have unique ID constraints and we MATCH them, MERGE (a)-[r:TYPE]->(b) is idempotent.
      await session.run(
        `
        MATCH (a {id: $source})
        MATCH (b {id: $target})
        MERGE (a)-[r:${type}]->(b)
        SET r += $properties
        `,
        { source, target, properties }
      );
      edgeCount++;
      if (edgeCount % 100 === 0) console.log(`...imported ${edgeCount} edges`);
    }
    console.log(`Finished importing ${edgeCount} edges.`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await session.close();
    await closeDriver();
  }
}

seed();
