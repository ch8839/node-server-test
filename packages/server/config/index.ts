import dotenv from 'dotenv';
import path from 'path';

// 加载 .env 文件（生产环境通常由部署平台注入环境变量，不依赖 .env 文件）
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

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
  isProd: boolean;
  server: ServerConfig;
  database: DatabaseConfig;
  databaseUrl: string;
}

function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export function loadConfig(): AppConfig {
  const env = optional('NODE_ENV', 'development');

  const database: DatabaseConfig = {
    type: optional('DB_TYPE', 'mysql'),
    host: optional('DB_HOST', '127.0.0.1'),
    port: Number(optional('DB_PORT', '3306')),
    username: optional('DB_USERNAME', 'root'),
    password: required('DB_PASSWORD'),
    database: optional('DB_DATABASE', 'dev_local_db'),
  };

  const databaseUrl =
    process.env.DATABASE_URL ||
    `${database.type}://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}`;

  return {
    env,
    isDev: env === 'development',
    isProd: env === 'production',
    server: {
      port: Number(optional('PORT', optional('SERVER_PORT', '3100'))),
    },
    database,
    databaseUrl,
  };
}
