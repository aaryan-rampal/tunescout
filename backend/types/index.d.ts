// Extend Express Request to include access_token in body
declare namespace Express {
  export interface Request {
    body: {
      access_token?: string;
      playlist_id?: string;
      number_of_songs?: number;
      number_of_refreshes?: number;
      tracks?: Track[];
      name?: string;
    };
  }
}

// ✅ Define a Track Interface
export interface Track {
  name: string;
  artist: string;
}

// ✅ Define a Request Interface for Spotify Access Token
export interface SpotifyAccessTokenRequest {
  access_token: string;
}

// ✅ Define an Interface for the Similar Tracks Fetching Function
export interface FetchSimilarTracksFn {
  (originalTracks: Track[], number_of_songs: number): Promise<Track[]>;
}
