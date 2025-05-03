import db from './connection';

export const runQuery = (sql: string): any[] => {
  return db.prepare(sql).all();
};
