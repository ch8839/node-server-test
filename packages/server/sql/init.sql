-- ============================================================
-- Database: dev_local_db
-- 初始化脚本 — 可直接导入 MySQL 执行
-- ============================================================

CREATE DATABASE IF NOT EXISTS `dev_local_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `dev_local_db`;

-- -----------------------------------------------------------
-- Table: todos
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `todos`;

CREATE TABLE `todos` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(255) NOT NULL,
  `content`    TEXT         DEFAULT NULL,
  `completed`  TINYINT(1)   NOT NULL DEFAULT 0,
  `priority`   INT          NOT NULL DEFAULT 0,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Seed data
-- -----------------------------------------------------------
INSERT INTO `todos` (`title`, `content`, `completed`, `priority`) VALUES
  ('学习 TypeScript',  '深入理解泛型、条件类型和映射类型', 0, 2),
  ('搭建 Express 服务', '使用 Prisma + MySQL 完成 CRUD demo', 1, 1),
  ('编写单元测试',      '为 Service 层添加 Jest 测试用例',    0, 1),
  ('配置 CI/CD',       '接入 GitHub Actions 自动部署',       0, 0),
  ('阅读 Prisma 文档',  NULL,                                0, 0);
