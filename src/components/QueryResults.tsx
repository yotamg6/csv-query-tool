'use client';

import { CsvQueryResult } from '../types/csv';
import ResultsPage from './ResultsPage';

interface SqlQueryResultsProps {
  results: CsvQueryResult;
}
const QueryResults = ({ results }: SqlQueryResultsProps) => {
  return <ResultsPage data={results} />;
};
export default QueryResults;
