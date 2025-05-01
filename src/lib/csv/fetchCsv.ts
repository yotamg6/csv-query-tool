import Papa, { ParseResult } from 'papaparse';

export const fetchCsvData = async (csvUrl: string): Promise<Record<string, string>[]> => {
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) {
      throw new Error('Failed to fetch CSV file.');
    }
    const csvText = await res.text();

    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result: ParseResult<Record<string, string>>) => {
          if (result.errors.length > 0) {
            const messages = result.errors.map((e) => e.message).join('; ');
            reject(messages);
          } else {
            resolve(result.data);
          }
        },
        error: (error: unknown) => {
          reject(error instanceof Error ? error : new Error('Unknown parse error'));
        },
      });
    });
  } catch (e) {
    console.error('e', e);
    throw e;
  }
};
