'use client';

import React from 'react';
import type { CsvQueryResult, CsvRow } from '../types/csv'; // Adjust path as needed

interface ResultsPageProps {
  data: CsvQueryResult;
}

const ResultsPage = ({ data }: ResultsPageProps) => {
  if (!data || !data.length) {
    return <div className="p-4 text-center text-gray-500">No results to display.</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-blue-100 text-gray-800">
          <tr>
            {columns.map((col) => (
              <th key={col} className="p-2 border-b border-gray-300 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: CsvRow, rowIndex: number) => (
            <tr key={rowIndex} className="even:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="p-2 border-b border-gray-200">
                  {row[col] !== null ? String(row[col]) : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsPage;
