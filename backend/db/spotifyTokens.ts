import db from "./db";

// Save tokens
export const saveTokens = (userId, accessToken, expiresAt) => {
  const stmt = db.prepare(`
      INSERT OR REPLACE INTO spotify_tokens (user_id, access_token, expires_at)
      VALUES (?, ?, ?)
    `);
  stmt.run(userId, accessToken, expiresAt);
};

// Get tokens for a user
export const getTokens = (userId) => {
  const stmt = db.prepare(`
      SELECT access_token, refresh_token, expires_at
      FROM spotify_tokens
      WHERE user_id = ?
    `);
  return stmt.get(userId);
};

// Update access token
export const updateAccessToken = (userId, accessToken, expiresAt) => {
  const stmt = db.prepare(`
      UPDATE spotify_tokens
      SET access_token = ?, expires_at = ?
      WHERE user_id = ?
    `);
  stmt.run(accessToken, expiresAt, userId);
};

export const getAllTokens = (): Array<{
  user_id: string;
  access_token: string;
  expires_at: string;
}> => {
  const stmt = db.prepare(`
    SELECT user_id, access_token, expires_at
    FROM spotify_tokens
  `);
  return stmt.all(); // Returns all rows as an array
};
