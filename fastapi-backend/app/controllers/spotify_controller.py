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
    async with httpx.AsyncClient() as client:
        params = {
            "client_id": request.client_id,
            "grant_type": "authorization_code",
            "code": request.code,
            "redirect_uri": request.redirect_uri,
            "code_verifier": request.code_verifier,
        }

        base_url = "https://accounts.spotify.com/api/token"

        response = await client.post(
            base_url,
            data=params,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        return response.json()
