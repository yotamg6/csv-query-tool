import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'src/lib/db/data.sqlite');

const db = new Database(DB_PATH);

export default db;
