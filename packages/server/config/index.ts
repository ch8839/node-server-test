import fs from 'fs';
import path from 'path';

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

function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = (result as Record<string, unknown>)[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      (result as Record<string, unknown>)[key] = deepMerge(
        tv as Record<string, unknown>,
        sv as Record<string, unknown>,
      );
    } else {
      (result as Record<string, unknown>)[key] = sv;
    }
  }
  return result;
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
  const merged = deepMerge(defaults, envOverrides) as {
    server: ServerConfig;
    database: DatabaseConfig;
  };

  const db = merged.database;
  if (process.env.DB_HOST) db.host = process.env.DB_HOST;
  if (process.env.DB_PORT) db.port = parseInt(process.env.DB_PORT, 10);
  if (process.env.DB_USERNAME) db.username = process.env.DB_USERNAME;
  if (process.env.DB_PASSWORD) db.password = process.env.DB_PASSWORD;
  if (process.env.DB_DATABASE) db.database = process.env.DB_DATABASE;

  if (process.env.PORT) merged.server.port = parseInt(process.env.PORT, 10);

  const databaseUrl = process.env.DATABASE_URL || buildDatabaseUrl(db);
  process.env.DATABASE_URL = databaseUrl;

  return {
    env,
    isDev: env === 'development',
    server: merged.server,
    database: db,
    databaseUrl,
  };
}
