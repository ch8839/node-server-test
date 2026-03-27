# Cursor Skill: gen commit

这个项目已经内置了一个 Cursor Skill：  
`/.cursor/skills/gen-commit/SKILL.md`

并提供了一个规则触发补充文件：  
`/.cursor/rules/gen-commit-skill.mdc`

## 触发方式

在 Cursor Chat 里输入任意一种（任意一种都可）：

- `gen commit`
- `/gen-commit`
- `use gen-commit skill`
- `生成 commit`

## 预期行为

触发后，Cursor 会按 Skill 规则：
- 基于当前改动生成 3 条中文 Conventional Commit 候选；
- 给出 1 条推荐项和简短理由；
- 你确认后，Cursor 只返回最终单行 commit message。

## 一键提交（可选）

如果你想让它直接执行本地提交，可以在 Chat 里补一句：

`使用 acm 自动提交`

然后 Cursor 会调用本地命令：

```bash
pnpm acm
```

> `acm` 脚本会再次校验 commitlint，避免不合规文案进入仓库。

## 建议使用流程

1. `git add -A`
2. 在 Cursor Chat 输入：`gen commit`
3. 选中候选并让 Cursor 返回最终 commit 文案
4. 手动 `git commit -m "..."`，或让 Cursor 执行 `pnpm acm`
