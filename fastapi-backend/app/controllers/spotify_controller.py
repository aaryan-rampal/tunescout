import httpx
from fastapi import Body, Header, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.playlists import AuthCodeBody, GeneratePlaylistRequest
from app.services import spotify_service
import logging


async def check_authorization(authorization: str):
    if not authorization:
        raise HTTPException(status_code=400, detail="Authorization header is required")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization format")

    token = authorization.removeprefix("Bearer ").strip()
    return token


async def get_playlists(authorization: str = Header(...)):
    token = await check_authorization(authorization)
    try:
        playlists = await spotify_service.get_playlists(token)
        return JSONResponse(content=playlists, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    token = await check_authorization(authorization)
    try:
        logger = logging.getLogger(__name__)
        logger.warning("I got here")
        original_tracks = await spotify_service.fetch_all_tracks(
            token, request.playlist_id
        )
        if len(original_tracks) <= 10:
            raise HTTPException(
                status_code=500, detail="Playlist does not have enough tracks."
            )

        similar_tracks = await spotify_service.fetch_similar_tracks(
            original_tracks, request.number_of_songs
        )
        spotify_tracks = await spotify_service.convert_to_spotify(token, similar_tracks)
        return JSONResponse(content=spotify_tracks, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
