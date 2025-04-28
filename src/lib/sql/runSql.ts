import alasql from 'alasql/dist/alasql.min.js';

export const runSqlQuery = async (
  data: Record<string, string>[],
  sqlQuery: string,
): Promise<Record<string, unknown>[]> => {
  // create in‐memory table
  alasql('CREATE TABLE data');
  alasql.tables.data.data = data;

  // run the SQL
  const result = alasql(sqlQuery) as Record<string, unknown>[];

  // clean up
  alasql('DROP TABLE data');

  return result;
};
