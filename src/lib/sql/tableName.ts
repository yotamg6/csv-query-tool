import path from 'path';

export const generateTableName = (csvUrl: string, csvHash: string): string => {
  try {
    const url = new URL(csvUrl);
    const basename = path.basename(url.pathname);
    const base = basename.replace(/\.csv$/i, '').replace(/[^a-zA-Z0-9_]/g, '_');
    return `csv_${base}_${csvHash.slice(0, 6)}`;
  } catch {
    return `csv_${csvHash.slice(0, 8)}`;
  }
};
