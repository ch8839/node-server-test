# AI Commit 工作流（Cursor Skill + acm）

## 0. Cursor Skill 触发词

项目已内置 Skill：`/.cursor/skills/gen-commit/SKILL.md`  
并配套规则触发文件：`/.cursor/rules/gen-commit-skill.mdc`  
在 Cursor Chat 输入以下任意指令可触发：

- `gen commit`
- `/gen-commit`
- `use gen-commit skill`
- `生成 commit`

## 1. 初始化

```bash
pnpm install
pnpm prepare
chmod +x .husky/commit-msg scripts/acm.mjs
```

## 2. 首选用法（Skill 指令）

在 Cursor Chat 中输入任一指令：

- `gen commit`
- `/gen-commit`
- `use gen-commit skill`
- `生成 commit`

Cursor 会自动按 Skill 规则分析改动并输出：
- 3 条规范候选；
- 1 条推荐及理由。

你确认一条后，可直接复制执行：

```bash
git commit -m "feat(scope): 你的中文提交信息"
```

## 3. 备用用法（本地脚本）

```bash
git add -A
pnpm acm
```

`pnpm acm` 会做这些事：
- 读取 staged diff；
- 生成多条规范 commit 候选；
- 让你选择或手动输入；
- 先跑 commitlint 校验，再执行 `git commit`。

## 4. Prompt 模板模式（可选）

如果你想手动改写提示词，再让 Cursor 生成，可用：

```bash
pnpm acm --prompt
```

将输出内容贴给 Cursor，也可按规则生成候选 commit。

## 5. 外部 AI 命令模式（可选）

脚本支持通过环境变量 `ACM_AI_CMD` 调外部命令，标准输入为 staged diff。  
命令只要输出“候选 commit 列表”（JSON 数组或多行文本）即可。

示例（本地模型）：

```bash
export ACM_AI_CMD='ollama run qwen2.5-coder:7b "请输出5条conventional commit（中文），每行一条，不要解释"'
pnpm acm
```

## 6. 推荐的 Commit 规范

- 格式：`type(scope): subject`
- type：`feat|fix|refactor|perf|docs|test|build|ci|chore|revert`
- subject：中文短句，描述真实变更，不要空泛。

## 7. 常见问题

- `没有检测到 staged 变更`：先执行 `git add <files>`。
- `commitlint 校验失败`：按报错修正文案，常见是 type 不合法或 subject 为空。
