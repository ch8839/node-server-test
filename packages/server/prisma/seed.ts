import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { loadConfig } from '../config';

const config = loadConfig();

const adapter = new PrismaMariaDb({
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  ssl: config.database.ssl,
  allowPublicKeyRetrieval: config.database.allowPublicKeyRetrieval,
});

const prisma = new PrismaClient({ adapter });

const todos = [
  { title: '学习 TypeScript', content: '深入理解泛型、条件类型和映射类型', priority: 2 },
  {
    title: '搭建 Express 服务',
    content: '使用 Prisma + MySQL 完成 CRUD demo',
    completed: true,
    priority: 1,
  },
  { title: '编写单元测试', content: '为 Service 层添加 Jest 测试用例', priority: 1 },
  { title: '配置 CI/CD', content: '接入 GitHub Actions 自动部署', priority: 0 },
  { title: '阅读 Prisma 文档', priority: 0 },
];

async function main() {
  console.log('Seeding...');
  for (const todo of todos) {
    await prisma.todo.create({ data: todo });
  }
  console.log(`Seeded ${todos.length} todos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
