import neo4j, { Driver } from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!uri || !user || !password) {
    throw new Error('Neo4j environment variables are missing.');
  }

  if (!driver) {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  return driver;
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
