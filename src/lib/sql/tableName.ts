import path from 'path';

export const generateTableName = (csvUrl: string, csvHash: string): string => {
  let url: URL;
  try {
    url = new URL(csvUrl);
  } catch {
    return `csv_${csvHash.slice(0, 8)}`;
  }

  const rawPath = url.pathname;
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(rawPath);
  } catch {
    decodedPath = rawPath;
  }

  const basename = path.basename(decodedPath);

  // Sanitize: remove extension, replace non-alphanumeric chars, collapse underscores, trim edges
  const base = basename
    .replace(/\.csv$/i, '') // strip .csv extension
    .replace(/[^a-zA-Z0-9_]/g, '_') // replace invalid chars
    .replace(/_+/g, '_') // collapse multiple underscores
    .replace(/^_+|_+$/g, ''); // trim leading/trailing underscores

  if (!base) {
    return `csv_${csvHash.slice(0, 8)}`;
  }

  return `csv_${base}_${csvHash.slice(0, 6)}`;
};
