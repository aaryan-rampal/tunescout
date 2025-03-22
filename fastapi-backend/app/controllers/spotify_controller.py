from fastapi import Body, Header
import httpx
from urllib import parse

from app.schemas.playlists import GeneratePlaylistRequest


async def get_user_playlists(authorization: str = Header(...)):
    pass


async def generate_playlist(
    authorization: str,
    request: GeneratePlaylistRequest,  # noqa: B008
):
    """Create an API endpoint to generate a playlist from Spotify.

    Args:
        authorization (str): Spotify authorization token.
        request (GeneratePlaylistRequest): Request body containing the playlist ID and
            number of songs.

    """
    pass


async def create_playlist(
    authorization: str = Header(...),
    request: GeneratePlaylistRequest = Body(...),  # noqa: B008
):
    pass

async def callback(code: str, code_verifier: str, redirect_uri: str):
    async with httpx.AsyncClient() as client:
        params = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "code_verifier": code_verifier,
        }
        base_url = "https://accounts.spotify.com/api/token"
        url = parse.urlencode(params)

