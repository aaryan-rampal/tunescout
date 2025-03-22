import httpx
from fastapi import Body, Header

from app.schemas.playlists import AuthCodeBody, GeneratePlaylistRequest


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


async def callback(request: AuthCodeBody):
    """Complete PKCE flow and get access token from Spotify.

    Args:
        request (AuthCodeBody): AuthCodeBody schema containing the code, redirect_uri,
        client_id, and code_verifier.

    Returns:
        response.json: JSON response from Spotify containing the access token.

    """
    async with httpx.AsyncClient() as client:
        base_url = "https://accounts.spotify.com/api/token"
        params = {
            "client_id": request.client_id,
            "grant_type": "authorization_code",
            "code": request.code,
            "redirect_uri": request.redirect_uri,
            "code_verifier": request.code_verifier,
        }

        response = await client.post(
            base_url,
            data=params,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        return response.json()
