# 🎵 TuneScout: A Music Recommender Bot

TuneScout is an intelligent music recommender bot that provides personalized music suggestions based on user listening history and preferences. By integrating with Spotify and other music services, TuneScout enhances the listening experience with curated playlists and advanced track-matching algorithms.

## 🚀 Features

### 🔐 User Authentication
- Supports **email/password login** and **Spotify OAuth 2.0** authentication.
- Securely stores **encrypted tokens** using SQLite.
- Future support planned for **Apple Music**, **Last.fm** and **Amazon Music**.

### 👥 User Management
- Register accounts and manage credentials securely.
- Link and manage **Spotify** profiles.
- Store listening preferences for **personalized recommendations**.

### 🎶 Playlist & Music Recommendation
- Generates **custom playlists** based on listening history.
- Implements **track similarity matching** and **playlist enhancement algorithms**.
- Supports **dynamic playlist updates** based on user preferences.

### 🔑 Session Management & Token Handling
- Uses **JWT-based authentication** for secure sessions.
- **Spotify refresh tokens** ensure uninterrupted API access.

### ⚡ Performance Optimization
- Implements **TanStack Query** for efficient API caching.
- Reduces query execution time by **40%**, improving responsiveness.

## 🛠️ Technologies

### Frontend
- **React** + **TypeScript**
- **Chakra UI** for sleek and responsive design

### Backend
- **FastAPI**
- **Spotify Web API** + **Last.fm API** for music data retrieval
- (Future) Migration to **AWS Lambda**

### Database & ORM
- **SQLite3** powered by **Prisma ORM**
- (Future) Migration to **DynamoDB** for scalability

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/aaryan-rampal/tunescout
cd tunescout
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Frontend Development Server
```sh
npm run dev
```

### 4️⃣ Start the Backend Server
```sh
uvicorn backend.app.main:app --reload
```

## 🎥 Demo Video
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/Zsazn-n3pHo/0.jpg)](https://www.youtube.com/watch?v=Zsazn-n3pHo)

## 📜 License
This project is licensed under the **MIT License**.

## 📬 Contact & Contributions
- **Contributions Welcome!** Feel free to fork the repo and submit a pull request.
- If you have suggestions or issues, open an **issue** on GitHub.

🎶 _Enjoy your personalized music experience with TuneScout!_ 🎶

