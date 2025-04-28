import Papa, { ParseResult } from 'papaparse';

export const fetchCsvData = async (csvUrl: string): Promise<Record<string, string>[]> => {
  const res = await fetch(csvUrl);
  if (!res.ok) {
    throw new Error('Failed to fetch CSV file.');
  }
  const csvText = await res.text();

  const result: ParseResult<Record<string, string>> = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    const msgs = result.errors.map((e) => e.message).join('; ');
    throw new Error('Error parsing CSV: ' + msgs);
  }
  return result.data;
};
