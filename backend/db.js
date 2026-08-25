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
  sortOrder INTEGER NOT NULL DEFAULT 0,
  imageUrl TEXT,
  dealType TEXT NOT NULL DEFAULT 'financing'
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
  roi REAL NOT NULL,
  amountEn TEXT,
  amountBn TEXT
);
`);

// Migration for DBs created before the imageUrl column existed.
const dealsColumns = db.prepare("PRAGMA table_info(deals)").all().map(c => c.name);
if (!dealsColumns.includes('imageUrl')) {
  db.exec('ALTER TABLE deals ADD COLUMN imageUrl TEXT');
}

// Migration for DBs created before the two funding tracks existed. Every deal
// that predates the equity track is a financing deal.
if (!dealsColumns.includes('dealType')) {
  db.exec("ALTER TABLE deals ADD COLUMN dealType TEXT NOT NULL DEFAULT 'financing'");
}

// Migration for DBs created before amountEn/amountBn existed on track_record.
const trackColumns = db.prepare("PRAGMA table_info(track_record)").all().map(c => c.name);
if (!trackColumns.includes('amountEn')) {
  db.exec('ALTER TABLE track_record ADD COLUMN amountEn TEXT');
}
if (!trackColumns.includes('amountBn')) {
  db.exec('ALTER TABLE track_record ADD COLUMN amountBn TEXT');
}

module.exports = db;
