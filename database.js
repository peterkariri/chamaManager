const Database = require('better-sqlite3');
const path = require('path');

// Creates a file "chama.db" in your project folder (your whole database)
const db = new Database(path.join(__dirname, 'chama.db'));
db.pragma('journal_mode = WAL'); // better performance

// Run once at startup: create tables only if they don't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    join_date TEXT NOT NULL DEFAULT (date('now'))
  );

  CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    month TEXT NOT NULL,
    date_paid TEXT NOT NULL DEFAULT (date('now')),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    principal REAL NOT NULL,
    interest_rate REAL NOT NULL DEFAULT 10,
    amount_repaid REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    date_issued TEXT NOT NULL DEFAULT (date('now')),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
  );
`);

module.exports = db;
