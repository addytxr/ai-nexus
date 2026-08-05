import neo4j, { Driver } from 'neo4j-driver';

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

declare global {
  var neo4jDriver: Driver | undefined;
}

let localDriver: Driver | undefined;

export function getDriver(): Driver {
  if (!uri || !user || !password) {
    throw new Error('Neo4j environment variables are missing.');
  }

  // In development, Next.js clears the module cache on every save.
  // We attach the driver to globalThis to prevent exhausting the DB connection pool.
  if (process.env.NODE_ENV !== 'production') {
    if (!globalThis.neo4jDriver) {
      globalThis.neo4jDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    }
    return globalThis.neo4jDriver;
  }

  // In production, the module cache is preserved.
  // We use a module-scoped variable to avoid polluting the global namespace.
  if (!localDriver) {
    localDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return localDriver;
}

// Optional helper for graceful shutdown in long-running Node environments
export async function closeDriver() {
  if (localDriver) await localDriver.close();
  if (globalThis.neo4jDriver) await globalThis.neo4jDriver.close();
}
