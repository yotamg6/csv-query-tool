import db from '@/lib/db/connection';
import * as cache from '@/lib/db/cache';
import type { Statement } from 'better-sqlite3';

jest.mock('../../../src/lib/db/connection', () => ({
  exec: jest.fn(),
  prepare: jest.fn(),
  transaction: jest.fn(),
}));

describe('cache.ts', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('ensureCacheTableExists calls exec with correct SQL', () => {
    // Spy and have exec return the db instance to satisfy signature
    const execSpy = jest.spyOn(db, 'exec').mockImplementation((sql: string) => db);

    cache.ensureCacheTableExists();

    expect(execSpy).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS csv_cache'),
    );
  });

  it('getTableNameByHash returns found table name', () => {
    const stmtMock = {
      get: () => ({ table_name: 'T1' }),
      run: () => {},
    } as unknown as Statement<any, any>;
    const prepSpy = jest.spyOn(db, 'prepare').mockReturnValue(stmtMock);

    const name = cache.getTableNameByHash('hash123');
    expect(prepSpy).toHaveBeenCalledWith('SELECT table_name FROM csv_cache WHERE hash = ?');
    expect(name).toBe('T1');
  });

  it('getTableNameByHash returns null when no row', () => {
    const stmtMock = {
      get: () => undefined,
      run: () => {},
    } as unknown as Statement<any, any>;
    jest.spyOn(db, 'prepare').mockReturnValue(stmtMock);

    expect(cache.getTableNameByHash('nope')).toBeNull();
  });

  it('registerCsvHash calls prepare and run with correct args', () => {
    const runMock = jest.fn();
    const stmtMock = {
      get: () => undefined,
      run: runMock,
    } as unknown as Statement<any, any>;
    const prepSpy = jest.spyOn(db, 'prepare').mockReturnValue(stmtMock);

    cache.registerCsvHash('h1', 'Tbl1');
    expect(prepSpy).toHaveBeenCalledWith('INSERT INTO csv_cache (hash, table_name) VALUES (?, ?)');
    expect(runMock).toHaveBeenCalledWith('h1', 'Tbl1');
  });
});
