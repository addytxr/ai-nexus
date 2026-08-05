import { getDriver, closeDriver } from '../lib/db/neo4j';

async function verify() {
  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (n) WITH count(n) AS nodes MATCH ()-[r]->() RETURN nodes, count(r) AS edges
    `);
    console.log(`Nodes: ${result.records[0].get('nodes').toInt()}`);
    console.log(`Edges: ${result.records[0].get('edges').toInt()}`);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
    await closeDriver();
  }
}
verify();
