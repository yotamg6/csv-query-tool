import db from '@/lib/db/connection';
import { createTable, insertRows } from '@/lib/db/tables';
import { safeColumn } from '@/lib/sql/utils';

// Mock dependencies
jest.mock('../../../src/lib/db/connection', () => ({
  exec: jest.fn(),
  prepare: jest.fn(),
  transaction: jest.fn(),
}));

jest.mock('../../../src/lib/sql/utils', () => ({
  safeColumn: jest.fn((col) => `safe_${col}`),
}));

describe('Database Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createTable', () => {
    it('should create a table with the specified columns', () => {
      // Setup
      const tableName = 'test_table';
      const columns = ['column1', 'column2', 'column3'];

      // Mock safeColumn to return a predictable value
      (safeColumn as jest.Mock).mockImplementation((col) => `safe_${col}`);

      // Execute the function
      createTable(tableName, columns);

      // Assertions
      expect(safeColumn).toHaveBeenCalledTimes(3);
      expect(safeColumn).toHaveBeenCalledWith('column1');
      expect(safeColumn).toHaveBeenCalledWith('column2');
      expect(safeColumn).toHaveBeenCalledWith('column3');

      expect(db.exec).toHaveBeenCalledTimes(1);
      expect(db.exec).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS test_table (safe_column1 TEXT, safe_column2 TEXT, safe_column3 TEXT);',
      );
    });

    it('should handle empty columns array', () => {
      // Setup
      const tableName = 'empty_table';
      const columns: string[] = [];

      // Execute the function
      createTable(tableName, columns);

      // Assertions
      expect(safeColumn).not.toHaveBeenCalled();

      expect(db.exec).toHaveBeenCalledTimes(1);
      expect(db.exec).toHaveBeenCalledWith('CREATE TABLE IF NOT EXISTS empty_table ();');
    });
  });

  describe('insertRows', () => {
    it('should insert multiple rows into the table', () => {
      // Setup
      const tableName = 'data_table';
      const columns = ['name', 'age', 'city'];
      const records: Record<string, string>[] = [
        { name: 'John', age: '30', city: 'New York' },
        { name: 'Jane', age: '25', city: 'Boston' },
        { name: 'Bob', age: '40', city: 'Chicago' },
      ];

      // Mock the database functions
      const mockRun = jest.fn();
      (db.prepare as jest.Mock).mockReturnValue({ run: mockRun });

      const mockTransaction = jest.fn((callback) => {
        return (data: any) => callback(data);
      });
      (db.transaction as jest.Mock).mockImplementation(mockTransaction);

      // Execute the function
      insertRows(tableName, columns, records);

      // Assertions
      expect(db.prepare).toHaveBeenCalledTimes(1);
      expect(db.prepare).toHaveBeenCalledWith('INSERT INTO data_table VALUES (?, ?, ?)');

      expect(db.transaction).toHaveBeenCalledTimes(1);

      // Verify each row was processed
      expect(mockRun).toHaveBeenCalledTimes(3);
      expect(mockRun).toHaveBeenNthCalledWith(1, ['John', '30', 'New York']);
      expect(mockRun).toHaveBeenNthCalledWith(2, ['Jane', '25', 'Boston']);
      expect(mockRun).toHaveBeenNthCalledWith(3, ['Bob', '40', 'Chicago']);
    });

    it('should handle missing values with null', () => {
      // Setup
      const tableName = 'partial_data';
      const columns = ['name', 'age', 'city'];
      // Using type assertion since we're intentionally testing how the function handles missing properties
      const records = [
        { name: 'John', age: '30' }, // missing city
        { name: 'Jane', city: 'Boston' }, // missing age
        { age: '40', city: 'Chicago' }, // missing name
      ] as Record<string, string>[];

      // Mock the database functions
      const mockRun = jest.fn();
      (db.prepare as jest.Mock).mockReturnValue({ run: mockRun });

      const mockTransaction = jest.fn((callback) => {
        return (data: any) => callback(data);
      });
      (db.transaction as jest.Mock).mockImplementation(mockTransaction);

      // Execute the function
      insertRows(tableName, columns, records);

      // Assertions
      expect(db.prepare).toHaveBeenCalledTimes(1);
      expect(db.prepare).toHaveBeenCalledWith('INSERT INTO partial_data VALUES (?, ?, ?)');

      // Verify each row was processed with nulls for missing values
      expect(mockRun).toHaveBeenCalledTimes(3);
      expect(mockRun).toHaveBeenNthCalledWith(1, ['John', '30', null]);
      expect(mockRun).toHaveBeenNthCalledWith(2, ['Jane', null, 'Boston']);
      expect(mockRun).toHaveBeenNthCalledWith(3, [null, '40', 'Chicago']);
    });

    it('should handle empty records array', () => {
      // Setup
      const tableName = 'empty_data';
      const columns = ['name', 'age', 'city'];
      const records = [] as Record<string, string>[];

      // Mock the database functions
      const mockRun = jest.fn();
      (db.prepare as jest.Mock).mockReturnValue({ run: mockRun });

      const mockTransaction = jest.fn((callback) => {
        return (data: any) => callback(data);
      });
      (db.transaction as jest.Mock).mockImplementation(mockTransaction);

      // Execute the function
      insertRows(tableName, columns, records);

      // Assertions
      expect(db.prepare).toHaveBeenCalledTimes(1);
      expect(db.prepare).toHaveBeenCalledWith('INSERT INTO empty_data VALUES (?, ?, ?)');

      // Verify no rows were processed
      expect(mockRun).not.toHaveBeenCalled();
    });
  });
});
