import db from './connection';

export const runQuery = (sql: string): unknown[] => {
  return db.prepare(sql).all();
};
