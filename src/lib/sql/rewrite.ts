import { Parser } from 'node-sql-parser';

const parser = new Parser();

export const rewriteQueryTable = (sql: string, actualTable: string): string => {
  try {
    const ast = parser.astify(sql);

    const rewrite = (node: unknown): void => {
      if (typeof node !== 'object' || node === null) return;

      const n = node as Record<string, unknown>;

      if (typeof n.table === 'string' && n.table.toLowerCase() === 'data') {
        n.table = actualTable;
      }

      for (const key in n) {
        if (Object.prototype.hasOwnProperty.call(n, key)) {
          // instead of n.hasOwnProperty(key) -
          // not to assume that n inherits from Object.prototype and has that method

          rewrite(n[key]);
        }
      }
    };

    rewrite(ast);
    return parser.sqlify(ast);
  } catch (err) {
    console.error('Failed to parse and rewrite SQL query:', err);
    return sql;
  }
};
