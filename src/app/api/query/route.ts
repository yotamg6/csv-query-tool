import { NextRequest, NextResponse } from 'next/server';
import { fetchCsvData } from '@/src/lib/csv/fetchCsv';
import { rewriteQueryTable } from '@/src/lib/sql/rewrite';
import { hashCsv } from '@/src/lib/utils/hash';
import { ensureCacheTableExists, getTableNameByHash, registerCsvHash } from '@/src/lib/db/cache';
import { createTable, insertRows } from '@/src/lib/db/tables';
import { runQuery } from '@/src/lib/db/runQuery';
import { generateTableName } from '@/src/lib/sql/tableName';

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
        return NextResponse.json({ message: 'No rows found', result: [] });
      }

      const columns = Object.keys(records[0]);
      tableName = generateTableName(csvUrl, csvHash);
      createTable(tableName, columns);
      insertRows(tableName, columns, records);
      registerCsvHash(csvHash, tableName);
    }

    const rewrittenQuery = rewriteQueryTable(sqlQuery, tableName);

    const result = runQuery(rewrittenQuery);
    return NextResponse.json({
      message: 'SQL query executed successfully.',
      result,
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
