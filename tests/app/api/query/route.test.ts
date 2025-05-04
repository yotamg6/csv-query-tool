import { NextRequest } from 'next/server';
import { fetchCsvData } from '@/lib/csv/fetchCsvData';
import { hashCsv } from '@/lib/utils/hash';
import { ensureCacheTableExists, getTableNameByHash, registerCsvHash } from '@/lib/db/cache';
import { generateTableName } from '@/lib/sql/tableName';
import { createTable, insertRows } from '@/lib/db/tables';
import { rewriteQueryTable } from '@/lib/sql/rewrite';
import { runQuery } from '@/lib/db/runQuery';
import { POST } from '@/app/api/query/route';

// Mock all dependencies
jest.mock('../../../../src/lib/db/connection', () => ({
  exec: jest.fn(),
  prepare: jest.fn(),
  transaction: jest.fn(),
}));
jest.mock('@/lib/csv/fetchCsvData');
jest.mock('@/lib/utils/hash');
jest.mock('@/lib/db/cache');
jest.mock('@/lib/sql/tableName');
jest.mock('@/lib/db/tables');
jest.mock('@/lib/sql/rewrite');
jest.mock('@/lib/db/runQuery');

// Mock next/server
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((data, options) => ({ data, options })),
    },
  };
});

// Get the mocked version of NextResponse.json
const getJsonMock = () => {
  return jest.requireMock('next/server').NextResponse.json;
};

describe('POST API Route Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup global fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('csv,data\nrow1,value1\nrow2,value2'),
      }),
    ) as jest.Mock;
  });

  it('should process new CSV data and run query successfully', async () => {
    // Setup test data
    const csvUrl = 'https://example.com/data.csv';
    const sqlQuery = 'SELECT * FROM table';
    const csvHash = 'hash123';
    const tableName = 'csv_hash123';
    const records = [
      { col1: 'value1', col2: 'value2' },
      { col1: 'value3', col2: 'value4' },
    ];
    const columns = ['col1', 'col2'];
    const queryResult = [{ col1: 'value1', col2: 'value2' }];
    const rewrittenQuery = 'SELECT * FROM csv_hash123';

    // Mock request
    const req = {
      json: () => Promise.resolve({ csvUrl, sqlQuery }),
    } as unknown as NextRequest;

    // Configure mocks
    (hashCsv as jest.Mock).mockReturnValue(csvHash);
    (getTableNameByHash as jest.Mock).mockReturnValue(null); // Table doesn't exist yet
    (fetchCsvData as jest.Mock).mockResolvedValue(records);
    (generateTableName as jest.Mock).mockReturnValue(tableName);
    (rewriteQueryTable as jest.Mock).mockReturnValue(rewrittenQuery);
    (runQuery as jest.Mock).mockReturnValue(queryResult);

    // Execute
    await POST(req);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(csvUrl);
    expect(hashCsv).toHaveBeenCalledWith(expect.any(String));
    expect(ensureCacheTableExists).toHaveBeenCalled();
    expect(getTableNameByHash).toHaveBeenCalledWith(csvHash);
    expect(fetchCsvData).toHaveBeenCalledWith(csvUrl);
    expect(generateTableName).toHaveBeenCalledWith(csvUrl, csvHash);
    expect(createTable).toHaveBeenCalledWith(tableName, columns);
    expect(insertRows).toHaveBeenCalledWith(tableName, columns, records);
    expect(registerCsvHash).toHaveBeenCalledWith(csvHash, tableName);
    expect(rewriteQueryTable).toHaveBeenCalledWith(sqlQuery, tableName);
    expect(runQuery).toHaveBeenCalledWith(rewrittenQuery);

    expect(getJsonMock()).toHaveBeenCalledWith({
      message: 'SQL query executed successfully.',
      result: queryResult,
    });
  });

  it('should use cached table when CSV has been processed before', async () => {
    // Setup test data
    const csvUrl = 'https://example.com/data.csv';
    const sqlQuery = 'SELECT * FROM table';
    const csvHash = 'hash123';
    const existingTableName = 'existing_table';
    const queryResult = [{ col1: 'value1', col2: 'value2' }];
    const rewrittenQuery = 'SELECT * FROM existing_table';

    // Mock request
    const req = {
      json: () => Promise.resolve({ csvUrl, sqlQuery }),
    } as unknown as NextRequest;

    // Configure mocks
    (hashCsv as jest.Mock).mockReturnValue(csvHash);
    (getTableNameByHash as jest.Mock).mockReturnValue(existingTableName); // Table exists
    (rewriteQueryTable as jest.Mock).mockReturnValue(rewrittenQuery);
    (runQuery as jest.Mock).mockReturnValue(queryResult);

    // Execute
    await POST(req);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(csvUrl);
    expect(hashCsv).toHaveBeenCalledWith(expect.any(String));
    expect(ensureCacheTableExists).toHaveBeenCalled();
    expect(getTableNameByHash).toHaveBeenCalledWith(csvHash);

    // These should not be called since we're using cached table
    expect(fetchCsvData).not.toHaveBeenCalled();
    expect(generateTableName).not.toHaveBeenCalled();
    expect(createTable).not.toHaveBeenCalled();
    expect(insertRows).not.toHaveBeenCalled();
    expect(registerCsvHash).not.toHaveBeenCalled();

    expect(rewriteQueryTable).toHaveBeenCalledWith(sqlQuery, existingTableName);
    expect(runQuery).toHaveBeenCalledWith(rewrittenQuery);

    expect(getJsonMock()).toHaveBeenCalledWith({
      message: 'SQL query executed successfully.',
      result: queryResult,
    });
  });

  it('should handle CSV fetch error', async () => {
    // Setup test data
    const csvUrl = 'https://example.com/invalid.csv';
    const sqlQuery = 'SELECT * FROM table';

    // Mock request
    const req = {
      json: () => Promise.resolve({ csvUrl, sqlQuery }),
    } as unknown as NextRequest;

    // Configure mocks - simulate fetch failure
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    ) as jest.Mock;

    // Execute
    await POST(req);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(csvUrl);
    expect(getJsonMock()).toHaveBeenCalledWith({ error: 'Failed to fetch CSV' }, { status: 500 });
  });

  it('should handle empty CSV data', async () => {
    // Setup test data
    const csvUrl = 'https://example.com/empty.csv';
    const sqlQuery = 'SELECT * FROM table';
    const csvHash = 'empty_hash';

    // Mock request
    const req = {
      json: () => Promise.resolve({ csvUrl, sqlQuery }),
    } as unknown as NextRequest;

    // Configure mocks
    (hashCsv as jest.Mock).mockReturnValue(csvHash);
    (getTableNameByHash as jest.Mock).mockReturnValue(null); // Table doesn't exist
    (fetchCsvData as jest.Mock).mockResolvedValue([]); // Empty records

    // Execute
    await POST(req);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(csvUrl);
    expect(hashCsv).toHaveBeenCalledWith(expect.any(String));
    expect(getTableNameByHash).toHaveBeenCalledWith(csvHash);
    expect(fetchCsvData).toHaveBeenCalledWith(csvUrl);
  });

  it('should handle query with no results', async () => {
    // Setup test data
    const csvUrl = 'https://example.com/data.csv';
    const sqlQuery = 'SELECT * FROM table WHERE 1=0';
    const csvHash = 'hash123';
    const existingTableName = 'existing_table';
    const rewrittenQuery = 'SELECT * FROM existing_table WHERE 1=0';

    // Mock request
    const req = {
      json: () => Promise.resolve({ csvUrl, sqlQuery }),
    } as unknown as NextRequest;

    // Configure mocks
    (hashCsv as jest.Mock).mockReturnValue(csvHash);
    (getTableNameByHash as jest.Mock).mockReturnValue(existingTableName); // Table exists
    (rewriteQueryTable as jest.Mock).mockReturnValue(rewrittenQuery);
    (runQuery as jest.Mock).mockReturnValue([]); // Empty result

    // Execute
    await POST(req);

    // Assertions
    expect(rewriteQueryTable).toHaveBeenCalledWith(sqlQuery, existingTableName);
    expect(runQuery).toHaveBeenCalledWith(rewrittenQuery);
  });

  it('should handle general errors', async () => {
    // Setup test data
    const csvUrl = 'https://example.com/data.csv';
    const sqlQuery = 'SELECT * FROM table';

    // Mock request
    const req = {
      json: () => Promise.resolve({ csvUrl, sqlQuery }),
    } as unknown as NextRequest;

    // Configure mocks to throw a general error
    global.fetch = jest.fn(() => {
      throw new Error('Network error');
    }) as jest.Mock;

    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Execute
    await POST(req);

    // Restore console.error
    console.error = originalConsoleError;

    // Assertions
    expect(fetch).toHaveBeenCalledWith(csvUrl);
    expect(getJsonMock()).toHaveBeenCalledWith({ error: 'Network error' }, { status: 500 });
  });
});
