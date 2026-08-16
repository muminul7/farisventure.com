const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'data', 'faris.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sector TEXT NOT NULL,
  structure TEXT NOT NULL,
  structureBn TEXT NOT NULL,
  status TEXT NOT NULL,
  amountEn TEXT NOT NULL,
  amountBn TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  nameBn TEXT NOT NULL,
  descEn TEXT NOT NULL,
  descBn TEXT NOT NULL,
  roi REAL,
  overviewEn TEXT NOT NULL DEFAULT '',
  overviewBn TEXT NOT NULL DEFAULT '',
  useEn TEXT NOT NULL DEFAULT '',
  useBn TEXT NOT NULL DEFAULT '',
  sortOrder INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS track_record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  nameEn TEXT NOT NULL,
  nameBn TEXT NOT NULL,
  category TEXT NOT NULL,
  round INTEGER,
  months INTEGER NOT NULL,
  durationEn TEXT NOT NULL,
  durationBn TEXT NOT NULL,
  roi REAL NOT NULL
);
`);

module.exports = db;
