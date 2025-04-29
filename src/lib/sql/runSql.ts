import { CsvQueryResult, CsvRow } from '@/src/types/csv';
import alasql from 'alasql/dist/alasql.min.js';

export const runSqlQuery = async (data: CsvRow[], sqlQuery: string): Promise<CsvQueryResult> => {
  alasql('CREATE TABLE data');
  alasql.tables.data.data = data;

  const result = alasql(sqlQuery) as CsvQueryResult;

  alasql('DROP TABLE data');

  return result;
};
