import { config } from './config';
import app from './app';
import { prisma } from './lib/prisma';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('[DB] Connected to MySQL');
  } catch (err) {
    console.error('[DB] Connection failed:', err);
    process.exit(1);
  }

  app.listen(config.server.port, () => {
    console.log(`[Server] Running at http://localhost:${config.server.port}`);
    console.log(`[Server] Environment: ${config.env}`);
  });
}

async function shutdown() {
  console.log('\n[Server] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
