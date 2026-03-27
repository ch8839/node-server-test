-- ============================================================
-- Database: dev_local_db
-- 种子数据 — 表结构由 prisma migrate 管理，此文件仅插入示例数据
-- 使用方式: mysql -u root -p19951030 dev_local_db < sql/init.sql
-- ============================================================

INSERT INTO `todos` (`title`, `content`, `completed`, `priority`, `created_at`, `updated_at`) VALUES
  ('学习 TypeScript',  '深入理解泛型、条件类型和映射类型', 0, 2, NOW(3), NOW(3)),
  ('搭建 Express 服务', '使用 Prisma + MySQL 完成 CRUD demo', 1, 1, NOW(3), NOW(3)),
  ('编写单元测试',      '为 Service 层添加 Jest 测试用例',    0, 1, NOW(3), NOW(3)),
  ('配置 CI/CD',       '接入 GitHub Actions 自动部署',       0, 0, NOW(3), NOW(3)),
  ('阅读 Prisma 文档',  NULL,                                0, 0, NOW(3), NOW(3));
