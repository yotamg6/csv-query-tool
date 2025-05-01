import { CsvQueryResult, CsvRow } from '@/src/types/csv';
import alasql from 'alasql/dist/alasql.min.js';

export const runSqlQuery = (data: CsvRow[], sqlQuery: string): CsvQueryResult => {
  try {
    alasql('CREATE TABLE data;');
    alasql.tables.data.data = data;

    const result = alasql(sqlQuery) as CsvQueryResult;
    return result;
  } catch (err: any) {
    console.error('SQL execution failed:', err.message || err);
    throw err;
  } finally {
    alasql('DROP TABLE data;');
  }
};
