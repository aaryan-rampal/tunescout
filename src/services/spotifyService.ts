import apiRequest from "../api/apiClient";

export const getPlaylists = async (accessToken: string) => {
  return apiRequest<any[]>("POST", "/get_playlists", {
    access_token: accessToken,
  });
};

export const generatePlaylist = async (
  playlistId: string,
  accessToken: string,
  numberOfRefreshes: number,
  numSongs: number,
) => {
  return apiRequest<any[]>("POST", "/generate_playlist", {
    playlist_id: playlistId,
    access_token: accessToken,
    number_of_refreshes: numberOfRefreshes,
    number_of_songs: numSongs,
  });
};

export const createPlaylist = async (
  accessToken: string,
  tracks: any[],
  name: string,
) => {
  return apiRequest<any>("POST", "/create_playlist", {
    access_token: accessToken,
    tracks,
    name,
  });
};
