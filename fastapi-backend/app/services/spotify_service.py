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


async def filter_duplicates(playlists: List[dict]):
    """Filter out duplicate playlists based on their IDs.

    Args:
        playlists (List[dict]): List of playlist dictionaries.

    Returns:
        List[dict]: List of unique playlists.

    """
    seen = set()
    unique_playlists = []
    for playlist in playlists:
        if playlist["id"] not in seen:
            seen.add(playlist["id"])
            unique_playlists.append(playlist)
    return unique_playlists


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

            filtered_playlists = await filter_duplicates(playlists)
            return filtered_playlists
        except HTTPException as e:
            print(str(e))
            raise
        except Exception as e:
            print("❌ Other error:", str(e))
            raise


def spotify_tracks_to_track(items: List[dict]) -> List[Track]:
    """Convert Spotify track items to Track schema.

    Args:
        items (List[dict]): List of track items from Spotify.

    Returns:
        List[Track]: List of Track objects.

    """
    return [
        Track(
            name=item["track"]["name"],
            artists=[artist["name"] for artist in item["track"]["artists"]],
            uri=item["track"]["uri"],
            image_url=(item["track"].get("album", {}).get("images") or [{}])[0].get(
                "url", ""
            ),
            id=item["track"]["id"],
        )
        for item in items
    ]


async def fetch_all_tracks(token: str, playlist_id: str):
    headers = {"Authorization": f"Bearer {token}"}
    track_ids = []
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    async with httpx.AsyncClient() as client:
        try:
            tracks = []
            while url:
                response = await client.get(url, headers=headers)
                response.raise_for_status()

                data = response.json()
                items = data.get("items", [])
                tracks.extend(spotify_tracks_to_track(items))
                url = data.get("next")

            return tracks

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
