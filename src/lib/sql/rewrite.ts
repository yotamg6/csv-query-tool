import { Parser } from 'node-sql-parser';

const parser = new Parser();

export const rewriteQueryTable = (sql: string, actualTable: string): string => {
  try {
    const ast = parser.astify(sql);

    const rewrite = (node: any) => {
      console.log('node', node);
      if (!node || typeof node !== 'object') return;

      if (node.table && typeof node.table === 'string' && node.table.toLowerCase() === 'data') {
        node.table = actualTable;
      }

      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          rewrite(node[key]);
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
