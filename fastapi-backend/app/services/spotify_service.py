from typing import List

import httpx
from fastapi import HTTPException

from app.schemas.playlists import Track

# Spotify service which handles all the calls to Spotify. Assuming all tokens passed
# into this class are valid and have been checked before they reach here.


def simplify(playlist):
    """Parse a playlist dict into only the items needed.

    Args:
        playlist (dict): Dictionary of playlist items received from Spotify.

    Returns:
        dict: Smaller subset of playlist with only required fields

    """
    return {
        "id": playlist["id"],
        "name": playlist["name"],
        "image": (playlist.get("images") or [{}])[0].get("url", ""),
    }


async def get_playlists(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    playlists = []
    url = "https://api.spotify.com/v1/me/playlists"
    async with httpx.AsyncClient() as client:
        try:
            while url:
                response = await client.get(url, headers=headers)
                response.raise_for_status()

                data = response.json()

                simplified_data = list(map(simplify, data.get("items", [])))
                playlists.extend(simplified_data)
                url = data.get("next")

            return playlists
        except HTTPException as e:
            print(str(e))
            raise
        except Exception as e:
            print("❌ Other error:", str(e))
            raise


async def fetch_all_tracks(token: str, playlist_id: str):
    headers = {"Authorization": f"Bearer {token}"}
    track_ids = []
    url = f"https://api.spotify.com/v1/me/playlists/{playlist_id}/tracks"
    async with httpx.AsyncClient() as client:
        try:
            while url:
                response = await client.get(url, headers=headers)
                response.raise_for_status()

                data = response.json()
                print(data.get("items", []))
                break

        except HTTPException as e:
            print(str(e))
            raise
        except Exception as e:
            print("❌ Other error:", str(e))
            raise

    pass



async def fetch_similar_tracks(original_tracks: List[Track], number_of_songs: int):
    pass


async def convert_to_spotify(token: str, similar_tracks: List[Track]):
    pass
