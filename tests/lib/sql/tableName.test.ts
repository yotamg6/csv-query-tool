import { generateTableName } from '@/lib/sql/tableName';

describe('generateTableName', () => {
  it('should extract and clean the filename from a valid URL', () => {
    const url = 'https://example.com/files/my file.csv';
    const hash = 'abcdef1234567890';
    const result = generateTableName(url, hash);
    expect(result).toBe('csv_my_file_abcdef');
  });

  it('should fall back to hash if URL is invalid', () => {
    const invalidUrl = 'not-a-valid-url';
    const hash = '123456abcdef7890';
    const result = generateTableName(invalidUrl, hash);
    expect(result).toBe('csv_123456ab');
  });

  it('should trim unsafe characters and append hash', () => {
    const url = 'https://test.com/uploads/@special%file.csv';
    const hash = 'deadbeefcafebabe';
    const result = generateTableName(url, hash);
    expect(result).toBe('csv_special_file_deadbe');
  });
});
