'use client';

import React from 'react';
import type { CsvQueryResult, CsvRow } from '../types/csv';
import Tooltip from '@mui/material/Tooltip';
import { CELL_WORD_LIMIT } from '../lib/constants';
import { calcTooltipMaxWidth } from '../lib/utils/text';

interface ResultsPageProps {
  data: CsvQueryResult;
}

const ResultsPage = ({ data }: ResultsPageProps) => {
  if (!data || !data.length) {
    return <div className="p-4 text-center text-gray-500">No results to display.</div>;
  }

  const SPAN_MAX_WIDTH = calcTooltipMaxWidth(CELL_WORD_LIMIT);

  const renderCell = (col: string, row: CsvRow) => {
    const cellValue = row[col];
    const text = cellValue !== null ? String(cellValue) : '—';
    const words = text.trim().split(/\s+/);
    const isLong = words.length > CELL_WORD_LIMIT;

    if (isLong) {
      return (
        <Tooltip
          title={text}
          arrow
          placement="top"
          disableHoverListener={words.length <= CELL_WORD_LIMIT}
          disableFocusListener={words.length <= CELL_WORD_LIMIT}
          disableTouchListener={words.length <= CELL_WORD_LIMIT}
          slotProps={{
            tooltip: {
              sx: {
                maxWidth: SPAN_MAX_WIDTH,
                padding: 2,
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
              },
            },
          }}
        >
          <span className="inline-block truncate" style={{ maxWidth: SPAN_MAX_WIDTH }}>
            {text}
          </span>
        </Tooltip>
      );
    }
    return text;
  };

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
                  {renderCell(col, row)}
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
