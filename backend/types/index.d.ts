declare namespace Express {
  export interface Request {
    // TODO: finish this
    body: {
      access_token?: string;
    };
  }
}

export interface SpotifyAccessTokenRequest {
  access_token: string;
}
