import { safeColumn } from '../sql/utils';
import db from './connection';

export const createTable = (tableName: string, columns: string[]) => {
  const columnDefs = columns.map((col) => `${safeColumn(col)} TEXT`).join(', ');
  db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs});`);
};

export const insertRows = (
  tableName: string,
  columns: string[],
  records: Record<string, string>[],
) => {
  const placeholders = columns.map(() => '?').join(', ');
  const insert = db.prepare(`INSERT INTO ${tableName} VALUES (${placeholders})`);
  const insertMany = db.transaction((rows: Record<string, string>[]) => {
    for (const row of rows) {
      insert.run(columns.map((col) => row[col] ?? null));
    }
  });
  insertMany(records);
};
