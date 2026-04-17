# 开发踩坑记录

> 本文档记录项目开发和部署过程中遇到的问题及解决方案。

## 项目结构

```
node-server-test/              # pnpm monorepo
├── packages/web/               # React + Vite 前端
├── packages/server/            # Express + Prisma 后端
└── packages/shared/            # 共享模块（zod schemas）
```

- **前端部署**：Render Static Site
- **后端部署**：Render Web Service
- **数据库**：TiDB Cloud Serverless（MySQL 兼容）

---

## 1. TiDB Cloud Serverless 要求 SSL 加密连接

### 问题

本地将 `.env` 切换为生产配置后，Prisma 连接 TiDB Cloud 数据库报错：

```
Connections using insecure transport are prohibited.
See https://docs.pingcap.com/tidbcloud/secure-connections-to-serverless-tier-clusters
```

Sequel Ace 能正常连接，因为它的 UI 中单独勾选了 SSL 选项。

### 原因

TiDB Cloud Serverless **强制要求 TLS 加密连接**。本项目使用 `@prisma/adapter-mariadb` 适配器，它直接通过 `host/port/user/password` 等独立参数建立连接，**不走 Prisma 的 `DATABASE_URL`**，所以即使在 URL 中添加 `?sslaccept=strict` 也不会生效。

### 解决

在 `PrismaMariaDb` 适配器的连接选项中传入 `ssl: true`，让底层 mariadb 驱动启用 TLS：

```typescript
// packages/server/src/lib/prisma.ts
const adapter = new PrismaMariaDb({
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  ssl: config.database.ssl, // DB_SSL=true 时启用
});
```

`.env` 中新增 `DB_SSL=true`（本地开发连接本机数据库时设为 `false`）。

---

## 2. Render Static Site 不兼容 `workspace:*` 协议

### 问题

在 Render 上以 Static Site 类型部署 `packages/web` 时，构建失败：

```
npm error could not resolve dependency: @monorepo/shared@"workspace:*"
```

### 原因

Render Static Site 的构建管线比较简化——在执行 Build Command 之前会**自动运行 `npm install`**，这一步无法跳过也无法覆盖。`npm` 不认识 pnpm 专有的 `workspace:*` 协议，导致依赖解析失败。

### 解决

将 `packages/web/package.json` 中的 `workspace:*` 改为 `file:` 协议：

```json
{
  "dependencies": {
    "@monorepo/shared": "file:../shared"
  }
}
```

`file:` 协议同时被 npm 和 pnpm 支持，本地开发不受影响。

---

## 3. `tsc` 不会转换路径别名为真实路径

### 问题

Server 端编译后运行 `node dist/src/server.js` 报错：

```
Cannot find module '@prisma/generated'
```

### 原因

`tsconfig.json` 中定义了路径别名：

```json
{
  "paths": {
    "@prisma/generated": ["./generated/prisma/client"]
  }
}
```

`tsc` 在编译时**只用 paths 做类型解析，不会在产物中把别名替换成真实的相对路径**。编译后的 `.js` 文件中依然是 `require("@prisma/generated")`，Node.js 运行时无法解析这个路径。

### 解决

安装 `tsc-alias`，在 `tsc` 编译后自动将别名替换为真实路径：

```json
{
  "scripts": {
    "build": "tsc && tsc-alias"
  }
}
```

---

## 4. 生产环境 `pnpm install` 跳过 devDependencies 导致 Husky 找不到

### 问题

Server 部署时执行 `pnpm install`，触发根目录 `package.json` 的 `prepare` 脚本，调用 `husky install`。但生产环境下 `pnpm install` 默认只安装 `dependencies`，`husky` 在 `devDependencies` 中因此未被安装，导致命令失败。

### 解决

将 `prepare` 脚本改为容错写法：

```json
{
  "scripts": {
    "prepare": "husky install || true"
  }
}
```

`|| true` 确保即使 `husky` 未安装，`prepare` 脚本也不会阻断整个 install 流程。

---

## 5. Server 部署的构建顺序问题

### 问题

Server 的构建涉及多个互相依赖的步骤，顺序不对就会失败：

| 步骤                     | 失败场景                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| 直接 `tsc` 编译          | `@types/express` 等类型声明在 devDependencies 中，生产安装时被跳过，类型检查报错                |
| 安装全部依赖后直接 `tsc` | `@prisma/generated` 目录还未生成（需要先 `prisma generate`），编译找不到模块                    |
| 漏装 workspace 依赖      | `server` 依赖 `@monorepo/shared`，必须使用 `--filter server...`（三个点）才能连带安装 shared 包 |

### 解决

设计了正确的四步构建流程（`deploy:server` 脚本）：

```json
{
  "scripts": {
    "deploy:server": "pnpm install --filter server... --prod=false && pnpm --filter server db:generate && pnpm --filter server build && pnpm install --filter server... --prod"
  }
}
```

**执行顺序解析：**

1. **`pnpm install --filter server... --prod=false`**
   安装 server 及其 workspace 依赖（shared）的**全部**依赖，包括 devDependencies（`@types/*`、`prisma`、`tsc-alias` 等），确保后续编译不会缺少类型声明。

2. **`pnpm --filter server db:generate`**
   运行 `prisma generate`，生成 `@prisma/generated` 目录，使 `tsc` 能正确解析该路径别名。

3. **`pnpm --filter server build`**
   执行 `tsc && tsc-alias`，编译 TypeScript 并替换路径别名。此时类型声明和 Prisma 生成代码都已就位，编译顺利通过。

4. **`pnpm install --filter server... --prod`**
   重新以生产模式安装依赖，移除 devDependencies，减小部署体积。
