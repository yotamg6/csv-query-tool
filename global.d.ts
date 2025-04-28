declare module 'alasql/dist/alasql.min.js' {
  interface AlaSQLOptions {
    noFileSystem?: boolean;
    autoCommit?: boolean;
    useSqlCache?: boolean;
    useMap?: boolean;
    joinstar?: string;
    casesensitive?: boolean;
    logtarget?: string;
    logprompt?: boolean;
    progress?: boolean;
    modifier?: unknown;
    columnlookup?: boolean;
    autoExtFilenameOnRead?: boolean;
    autoExtFilenameOnWrite?: boolean;
    [key: string]: unknown;
  }

  interface AlaSQLTable {
    data: Record<string, unknown>[];
    name?: string;
    [key: string]: unknown;
  }

  interface AlaSQLDatabase {
    tables: Record<string, AlaSQLTable>;
    [key: string]: unknown;
  }

  interface AlaSQLFunction {
    <T = unknown>(sql: string, ...params: unknown[]): T;
    options: AlaSQLOptions;
    tables: Record<string, AlaSQLTable>;
    databases: Record<string, AlaSQLDatabase>;

    // Common methods
    promise(sql: string, ...params: unknown[]): Promise<unknown>;
    compile(sql: string): (...params: unknown[]) => unknown;
    exec(sql: string, ...params: unknown[]): unknown;

    // Additional properties and methods
    version: string;
    parser: Record<string, unknown>;
    utils: Record<string, unknown>;
  }

  const alasql: AlaSQLFunction;
  export default alasql;
}
