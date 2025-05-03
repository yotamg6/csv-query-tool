import db from './connection';

export const ensureCacheTableExists = () => {
  db.exec(`
      CREATE TABLE IF NOT EXISTS csv_cache (
        hash TEXT PRIMARY KEY,
        table_name TEXT NOT NULL
      );
    `);
};

export const getTableNameByHash = (hash: string): string | null => {
  const row = db.prepare('SELECT table_name FROM csv_cache WHERE hash = ?').get(hash) as
    | { table_name: string }
    | undefined;

  return row?.table_name ?? null;
};

export const registerCsvHash = (hash: string, tableName: string) => {
  db.prepare('INSERT INTO csv_cache (hash, table_name) VALUES (?, ?)').run(hash, tableName);
};
