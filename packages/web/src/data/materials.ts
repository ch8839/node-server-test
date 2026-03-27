export interface MaterialItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readmePath: string;
  demoPath: string;
}

export const materials: MaterialItem[] = [
  {
    id: "stats-kpi-card",
    title: "KPI 统计卡片",
    description: "用于 Dashboard 场景的核心指标展示，支持趋势和环比信息。",
    category: "Data Display",
    tags: ["Card", "KPI", "Dashboard"],
    readmePath: "stats-kpi-card/README.md",
    demoPath: "stats-kpi-card/index.tsx",
  },
  {
    id: "empty-state-panel",
    title: "空状态面板",
    description: "统一空状态视觉和文案风格，降低业务页空白区域设计成本。",
    category: "Feedback",
    tags: ["Empty", "Panel", "UX"],
    readmePath: "empty-state-panel/README.md",
    demoPath: "empty-state-panel/index.tsx",
  },
  {
    id: "todo-list",
    title: "TodoList",
    description: "一个对接数据库的todoList demo",
    category: "Data Display",
    tags: ["List", "Todo", "Database"],
    readmePath: "TodoList/README.md",
    demoPath: "TodoList/index.tsx",
  },
];

export function getMaterialById(materialId?: string) {
  if (!materialId) return undefined;
  return materials.find((item) => item.id === materialId);
}
