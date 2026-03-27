// 常见工具函数

export const getObjectPathValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, cur) => acc && acc[cur], obj);
};

export const deepMerge = <T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T => {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = (result as Record<string, unknown>)[key];
    if (
      sv &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        tv as Record<string, unknown>,
        sv as Record<string, unknown>
      );
    } else {
      (result as Record<string, unknown>)[key] = sv;
    }
  }
  return result;
};
