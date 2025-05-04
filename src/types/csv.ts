export type CsvValue = string | number | boolean | null;

export type CsvRow = Record<string, CsvValue>;

export type CsvQueryResult = CsvRow[];

export interface QueryResponse {
  message: string;
  result: CsvQueryResult;
}

export interface RowObject {
  [key: string]: string | number | boolean | null;
}
