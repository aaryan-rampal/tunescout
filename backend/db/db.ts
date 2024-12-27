import Database from "better-sqlite3";

// Initialize the database
const db = new Database("spotify_tokens.db");

// Create the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS spotify_tokens (
    user_id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    expires_at DATETIME NOT NULL
  )
`);

export default db;