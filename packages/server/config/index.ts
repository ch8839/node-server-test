import fs from 'fs';
import path from 'path';
import deepmerge from 'deepmerge';

interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface ServerConfig {
  port: number;
}

export interface AppConfig {
  env: string;
  isDev: boolean;
  server: ServerConfig;
  database: DatabaseConfig;
  databaseUrl: string;
}

function loadJsonFile(filePath: string): Record<string, unknown> {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function buildDatabaseUrl(db: DatabaseConfig): string {
  return `${db.type}://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`;
}

export function loadConfig(): AppConfig {
  const configDir = path.resolve(__dirname);
  const env = process.env.NODE_ENV || 'development';

  const defaults = loadJsonFile(path.join(configDir, 'default.json'));
  const envOverrides = loadJsonFile(path.join(configDir, `${env}.json`));
  const merged = deepmerge(defaults, envOverrides) as {
    server: ServerConfig;
    database: DatabaseConfig;
  };

  const databaseUrl = buildDatabaseUrl(merged.database);

  return {
    env,
    isDev: env === 'development',
    server: merged.server,
    database: merged.database,
    databaseUrl,
  };
}
