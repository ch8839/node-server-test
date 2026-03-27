#!/usr/bin/env node

import { execSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync, unlinkSync } from "node:fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

function run(command) {
  return execSync(command, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function safeRun(command) {
  try {
    return run(command);
  } catch {
    return "";
  }
}

function getStagedFiles() {
  const raw = safeRun("git diff --cached --name-only");
  return raw ? raw.split("\n").filter(Boolean) : [];
}

function getNameStatus() {
  const raw = safeRun("git diff --cached --name-status");
  return raw ? raw.split("\n").filter(Boolean) : [];
}

function getScope(files) {
  if (files.length === 0) return "core";
  const first = files[0].split("/");
  if (first[0] === "src" && first[1]) return first[1];
  if (first[0]) return first[0].replace(/[^a-zA-Z0-9-_]/g, "") || "core";
  return "core";
}

function inferType(files, statuses) {
  const filesText = files.join(" ").toLowerCase();
  const onlyDocs = files.length > 0 && files.every((f) => f.endsWith(".md") || f.startsWith("docs/"));
  if (onlyDocs) return "docs";
  if (/test|spec/.test(filesText)) return "test";
  if (/package\.json|pnpm-lock|yarn\.lock|package-lock/.test(filesText)) return "chore";
  if (/\.github|\.gitlab-ci|dockerfile|vite\.config|tsconfig|eslint/.test(filesText)) return "build";
  if (statuses.some((line) => line.startsWith("A\t"))) return "feat";
  return "refactor";
}

function buildTopic(scope, files) {
  if (scope === "pages") return "页面";
  if (scope === "router") return "路由";
  if (scope === "layouts") return "布局";
  if (scope === "styles" || scope === "theme") return "样式";
  if (scope === "data") return "数据";
  if (scope === "scripts") return "脚本";
  if (files.some((f) => f.includes("MaterialDetail"))) return "物料详情页";
  return "功能";
}

function parseAiCandidates(raw) {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
  } catch {
    // ignore JSON parse errors and fallback to line parsing
  }
  return raw
    .split("\n")
    .map((x) => x.replace(/^\s*[-*\d.)]+\s*/, "").trim())
    .filter(Boolean);
}

function getAiCandidates(diffText) {
  const aiCmd = process.env.ACM_AI_CMD;
  if (!aiCmd) return [];

  const child = spawnSync(aiCmd, {
    shell: true,
    input: diffText,
    encoding: "utf8"
  });
  if (child.status !== 0) return [];
  return parseAiCandidates(child.stdout).slice(0, 5);
}

function buildPrompt(diffText) {
  return [
    "请根据以下 staged git diff 生成 5 条候选 Conventional Commit（中文）。",
    "要求：",
    "1) 格式必须是 type(scope): subject",
    "2) type 仅可用：feat/fix/refactor/perf/docs/test/build/ci/chore/revert",
    "3) subject 使用中文，简洁明确，避免“更新代码”“修复问题”这种空泛描述",
    "4) 不要输出解释文字，只输出编号列表",
    "",
    "staged diff:",
    diffText
  ].join("\n");
}

function escapeDoubleQuotes(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildDefaultCandidates(type, scope, topic) {
  return [
    `${type}(${scope}): 完善${topic}交互与展示`,
    `fix(${scope}): 修复${topic}中的边界问题`,
    `refactor(${scope}): 重构${topic}相关实现`,
    `chore(${scope}): 调整${topic}相关配置`,
    `docs(${scope}): 更新${topic}使用说明`
  ];
}

function lintCommitMessage(message) {
  const tempFile = join(tmpdir(), `acm-commit-msg-${Date.now()}.txt`);
  writeFileSync(tempFile, `${message}\n`, "utf8");
  try {
    const result = spawnSync("pnpm", ["exec", "commitlint", "--edit", tempFile], {
      stdio: "pipe",
      encoding: "utf8"
    });
    if (result.status === 0) return { ok: true, output: "" };
    return { ok: false, output: (result.stdout || "") + (result.stderr || "") };
  } catch {
    return { ok: true, output: "" };
  } finally {
    try {
      unlinkSync(tempFile);
    } catch {
      // ignore
    }
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const diffText = safeRun("git diff --cached");
  if (args.has("--prompt")) {
    console.log(buildPrompt(diffText || "(当前 staged diff 为空)"));
    process.exit(0);
  }

  const files = getStagedFiles();
  if (files.length === 0) {
    console.error("没有检测到 staged 变更。请先执行 git add。");
    process.exit(1);
  }

  const statuses = getNameStatus();
  const scope = getScope(files);
  const type = inferType(files, statuses);
  const topic = buildTopic(scope, files);
  const defaultCandidates = buildDefaultCandidates(type, scope, topic);
  const aiCandidates = getAiCandidates(diffText);
  const candidates = [...aiCandidates, ...defaultCandidates]
    .filter((x, i, arr) => arr.indexOf(x) === i)
    .slice(0, 8);

  console.log("\n已暂存文件：");
  files.forEach((file) => console.log(`- ${file}`));
  console.log("\n候选 commit message：");
  candidates.forEach((candidate, idx) => console.log(`${idx + 1}) ${candidate}`));
  console.log("m) 手动输入");
  console.log("p) 输出给 Cursor 的生成提示词");
  console.log("q) 退出");

  const rl = readline.createInterface({ input, output });
  const answer = (await rl.question("\n请选择候选项: ")).trim().toLowerCase();
  let message = "";

  if (answer === "q") {
    rl.close();
    process.exit(0);
  }
  if (answer === "p") {
    console.log("\n--- Prompt For Cursor ---\n");
    console.log(buildPrompt(diffText));
    rl.close();
    process.exit(0);
  }
  if (answer === "m") {
    message = (await rl.question("请输入 commit message: ")).trim();
  } else {
    const index = Number(answer);
    if (!Number.isInteger(index) || index < 1 || index > candidates.length) {
      rl.close();
      console.error("选择无效，已退出。");
      process.exit(1);
    }
    message = candidates[index - 1];
  }

  rl.close();
  if (!message) {
    console.error("commit message 不能为空。");
    process.exit(1);
  }

  const lintResult = lintCommitMessage(message);
  if (!lintResult.ok) {
    console.error("\ncommitlint 校验失败：");
    console.error(lintResult.output || "请检查 commit message 格式");
    process.exit(1);
  }

  try {
    execSync(`git commit -m "${escapeDoubleQuotes(message)}"`, { stdio: "inherit" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`提交失败: ${error.message}`);
    } else {
      console.error("提交失败。");
    }
    process.exit(1);
  }
}

main();
