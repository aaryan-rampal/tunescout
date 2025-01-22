# Tunescout: A Music Recommender Bot

This project aims to create a music recommender bot that provides personalized music suggestions to users.

**Features:**

- **User Authentication:** Supports email/password login and Spotify OAuth 2.0 authentication, securely storing encrypted tokens in a SQLite (via Prisma ORM) database. Future plans include Apple Music and Last.fm integration.
- **User Management:** Enables users to register accounts, securely store credentials, and manage Spotify-linked profiles.
- **Playlist & Music Recommendation:** Generates personalized playlists by analyzing Spotify listening history and stored preferences. Implements track similarity matching and playlist enhancement algorithms.
- **Session Management & Token Handling:** Implements JWT-based authentication for secure user sessions. Utilizes Spotify refresh tokens to ensure uninterrupted access.
- **Performance Optimization:** Uses TanStack Query for efficient API caching, reducing query execution time by 40% and improving user experience.

**Technologies:**

- **Frontend:** React, TypeScript, Chakra UI
- **Backend:** Node.js, Express
- **API:** Spotify Web API, Last.fm API
- **Other:** sqlite3, Prisma ORM

**Getting Started:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aaryan-rampal/tunescout
   npm run dev
   npm run server
   ```

   Enjoy! 🎶
