export const safeColumn = (col: string) => `\`${col.replace(/`/g, '``')}\``;
