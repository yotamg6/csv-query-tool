import { fetchCsvData } from '@/src/lib/csv/fetchCsv';
import { runSqlQuery } from '@/src/lib/sql/runSql';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { csvUrl, sqlQuery } = await req.json();

    const csvData = await fetchCsvData(csvUrl);

    const queryResult = await runSqlQuery(csvData, sqlQuery);

    return NextResponse.json({
      message: 'SQL query executed successfully.',
      result: queryResult,
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
