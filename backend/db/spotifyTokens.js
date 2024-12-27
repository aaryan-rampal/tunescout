import db from "./db";

// Save tokens
const saveTokens = (userId, accessToken, refreshToken, expiresAt) => {
  const stmt = db.prepare(`
      INSERT OR REPLACE INTO spotify_tokens (user_id, access_token, refresh_token, expires_at)
      VALUES (?, ?, ?, ?)
    `);
  stmt.run(userId, accessToken, refreshToken, expiresAt);
};

// Get tokens for a user
const getTokens = (userId) => {
  const stmt = db.prepare(`
      SELECT access_token, refresh_token, expires_at
      FROM spotify_tokens
      WHERE user_id = ?
    `);
  return stmt.get(userId);
};

// Update access token
const updateAccessToken = (userId, accessToken, expiresAt) => {
  const stmt = db.prepare(`
      UPDATE spotify_tokens
      SET access_token = ?, expires_at = ?
      WHERE user_id = ?
    `);
  stmt.run(accessToken, expiresAt, userId);
};

module.exports = {
  saveTokens,
  getTokens,
  updateAccessToken,
};
