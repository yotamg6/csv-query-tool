import { NextRequest, NextResponse } from 'next/server';
import { fetchCsvData } from '@/lib/csv/fetchCsvData';
import { hashCsv } from '@/lib/utils/hash';
import { ensureCacheTableExists, getTableNameByHash, registerCsvHash } from '@/lib/db/cache';
import { generateTableName } from '@/lib/sql/tableName';
import { createTable, insertRows } from '@/lib/db/tables';
import { rewriteQueryTable } from '@/lib/sql/rewrite';
import { runQuery } from '@/lib/db/runQuery';

export const POST = async (req: NextRequest) => {
  try {
    const { csvUrl, sqlQuery } = await req.json();

    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error('Failed to fetch CSV');
    const csvText = await res.text();
    const csvHash = hashCsv(csvText);

    ensureCacheTableExists();

    let tableName = getTableNameByHash(csvHash);
    if (!tableName) {
      const records = await fetchCsvData(csvUrl);
      if (!records.length) {
        return new NextResponse(null, { status: 204 });
      }

      const columns = Object.keys(records[0]);
      tableName = generateTableName(csvUrl, csvHash);
      createTable(tableName, columns);
      insertRows(tableName, columns, records);
      registerCsvHash(csvHash, tableName);
    }

    const rewrittenQuery = rewriteQueryTable(sqlQuery, tableName);

    const result = runQuery(rewrittenQuery);
    if (!result.length) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json({
      message: 'SQL query executed successfully.',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
