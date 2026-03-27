import { defineConfig } from 'prisma/config';
import { loadConfig } from './config';

const appConfig = loadConfig();

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: appConfig.databaseUrl,
  },
  // @ts-expect-error Prisma v7 types lag behind runtime support for seed config
  seed: {
    command: 'tsx prisma/seed.ts',
  },
});
