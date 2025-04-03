import asyncio
import random
from typing import Callable, List, TypeVar

import httpx

from app.schemas.playlists import Track
from app.utils import catch_http_errors, get_lastfm_key

T = TypeVar("T")


def simplify(playlist: dict) -> dict:
    """Parse a playlist dict into only the items needed.

    Args:
        playlist (dict): Dictionary of playlist items received from Spotify.

    Returns:
        dict: Smaller subset of playlist with only required fields.
    """
    return {
        "id": playlist["id"],
        "name": playlist["name"],
        "image": (playlist.get("images") or [{}])[0].get("url", ""),
    }


def remove_duplicates_generic(items: List[T], key_func: Callable[[T], str]) -> List[T]:
    """Remove duplicate items from a list based on a key function.

    Args:
        items (List[T]): List of items to deduplicate.
        key_func (Callable[[T], str]): Function to extract a unique key from each item.

    Returns:
        List[T]: List of unique items.
    """
    seen = set()
    unique_items = []
    for item in items:
        key = key_func(item)
        if key not in seen:
            seen.add(key)
            unique_items.append(item)
    return unique_items


async def filter_duplicates(playlists: List[dict]) -> List[dict]:
    """Filter out duplicate playlists based on their IDs.

    Args:
        playlists (List[dict]): List of playlist dictionaries.

    Returns:
        List[dict]: List of unique playlists.
    """
    return remove_duplicates_generic(playlists, key_func=lambda x: x["id"])


@catch_http_errors
async def get_playlists(token: str) -> List[dict]:
    """Retrieve all playlists for the authenticated user.

    Args:
        token (str): Spotify authorization token.

    Returns:
        List[dict]: List of playlists.
    """
    headers = {"Authorization": f"Bearer {token}"}
    playlists = []
    url = "https://api.spotify.com/v1/me/playlists"
    async with httpx.AsyncClient() as client:
        while url:
            response = await client.get(url, headers=headers)
            response.raise_for_status()

            data = response.json()

            simplified_data = list(map(simplify, data.get("items", [])))
            playlists.extend(simplified_data)
            url = data.get("next")

        filtered_playlists = await filter_duplicates(playlists)
        return filtered_playlists


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


@catch_http_errors
async def fetch_all_tracks(token: str, playlist_id: str) -> List[Track]:
    """Fetch all tracks from a Spotify playlist.

    Args:
        token (str): Spotify authorization token.
        playlist_id (str): ID of the Spotify playlist.

    Returns:
        List[Track]: List of tracks in the playlist.
    """
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    async with httpx.AsyncClient() as client:
        tracks = []
        while url:
            response = await client.get(url, headers=headers)
            response.raise_for_status()

            data = response.json()
            items = data.get("items", [])
            tracks.extend(spotify_tracks_to_track(items))
            url = data.get("next")

        return tracks


@catch_http_errors
async def fetch_enough_similar_tracks(
    original_tracks: List[Track], number_of_songs: int
) -> List[Track]:
    """Fetch a sufficient number of similar tracks from Last.fm.

    Args:
        original_tracks (List[Track]): List of original tracks.
        number_of_songs (int): Number of songs to fetch.

    Returns:
        List[Track]: List of similar tracks.
    """
    similar_tracks = await fetch_similar_tracks(original_tracks, number_of_songs)
    return similar_tracks


def convert_lastfm_to_track(x: dict) -> Track:
    """Convert a Last.fm track dictionary to a Track object.

    Args:
        x (dict): Last.fm track dictionary.

    Returns:
        Track: Converted Track object.
    """
    return Track(
        name=x["name"],
        artists=[x["artist"]["name"]],
        uri="",
        image_url="",
        id=str(hash(x.get("url"))),
        similarity=x.get("match", 0.0),
    )


async def fetch_similar_tracks(
    original_tracks: List[Track], number_of_songs: int
) -> List[Track]:
    """Fetch similar tracks from Last.fm for a list of original tracks.

    Args:
        original_tracks (List[Track]): List of original tracks.
        number_of_songs (int): Number of similar tracks to fetch.

    Returns:
        List[Track]: List of similar tracks.
    """
    lastfm_key = get_lastfm_key()
    all_similar_tracks = []

    async with httpx.AsyncClient() as client:
        tasks = [
            fetch_from_lastapi(number_of_songs, lastfm_key, client, track)
            for track in original_tracks
        ]
        results = await asyncio.gather(*tasks)

        for similar_tracks in results:
            similar_tracks = list(map(convert_lastfm_to_track, similar_tracks))
            all_similar_tracks.extend(similar_tracks)

    all_similar_tracks = remove_duplicates(all_similar_tracks)
    best_tracks = get_best_tracks(all_similar_tracks, number_of_songs)

    print("Similar tracks:", best_tracks)
    return best_tracks


def get_best_tracks(
    all_similar_tracks: List[Track], number_of_songs: int
) -> List[Track]:
    """Select the best tracks based on similarity and shuffle them.

    Args:
        all_similar_tracks (List[Track]): List of all similar tracks.
        number_of_songs (int): Number of tracks to select.

    Returns:
        List[Track]: List of selected tracks.
    """
    if len(all_similar_tracks) <= number_of_songs:
        return all_similar_tracks

    best_tracks = sorted(all_similar_tracks, key=lambda x: x.similarity, reverse=True)

    # TODO: this is a design choice
    n = len(all_similar_tracks)
    best_tracks = best_tracks[: int(n * 0.4)]

    random.shuffle(best_tracks)
    return best_tracks[:number_of_songs]


def remove_duplicates(all_similar_tracks: List[Track]) -> List[Track]:
    """Remove duplicate tracks based on their IDs.

    Args:
        all_similar_tracks (List[Track]): List of similar tracks.

    Returns:
        List[Track]: List of unique tracks.
    """
    return remove_duplicates_generic(all_similar_tracks, key_func=lambda x: x.id)


async def fetch_from_lastapi(
    number_of_songs: int, lastfm_key: str, client: httpx.AsyncClient, track: Track
) -> List[dict]:
    """Fetch similar tracks from Last.fm API for a given track.

    Args:
        number_of_songs (int): Number of similar tracks to fetch.
        lastfm_key (str): Last.fm API key.
        client (httpx.AsyncClient): HTTP client for making requests.
        track (Track): Original track to find similar tracks for.

    Returns:
        List[dict]: List of similar tracks from Last.fm.
    """
    params = {
        "method": "track.getsimilar",
        "artist": track.artists[0],
        "track": track.name,
        "api_key": lastfm_key,
        "limit": number_of_songs,
        "format": "json",
    }
    response = await client.get(
        "https://ws.audioscrobbler.com/2.0/?method=track.getsimilar",
        params=params,
    )
    response.raise_for_status()
    data = response.json()
    similar_tracks = data["similartracks"]["track"]
    return similar_tracks


async def convert_to_spotify(token: str, similar_tracks: List[Track]) -> List[dict]:
    """Convert a list of similar tracks to Spotify format.

    Args:
        token (str): Spotify authorization token.
        similar_tracks (List[Track]): List of similar tracks.

    Returns:
        List[dict]: List of tracks in Spotify format.
    """
    pass
