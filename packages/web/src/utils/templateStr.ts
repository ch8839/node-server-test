export const templateUtil1 = (
  template: string,
  data: { [key: string]: any }
) => {
  return template.replace(/\{(.+?)\}/g, (node, key) => {
    return data[key];
  });
};

export const templateUtil2 = (
  template: string,
  data: { [key: string]: any }
) => {
  return new Function("data", `return \`${template}\``)(data);
};

export const templateUtil3 = (
  template: string,
  data: { [key: string]: any }
) => {
  return new Function(
    "data",
    `return \`${template.replace(/\{(.+?)\}/g, "${data.$1}")}\` `
  )(data);
};
