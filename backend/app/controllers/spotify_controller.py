
import httpx
from fastapi import Body, Header, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.playlists import AuthCodeBody, GeneratePlaylistRequest
from app.services import spotify_service
from app.utils import catch_http_errors


async def check_authorization(authorization: str) -> str:
    """Check and validate the authorization header.

    Args:
        authorization (str): Authorization header value.

    Returns:
        str: Extracted token from the authorization header.

    Raises:
        HTTPException: If the authorization header is missing or invalid.
    """
    if not authorization:
        raise HTTPException(status_code=400, detail="Authorization header is required")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization format")

    token = authorization.removeprefix("Bearer ").strip()
    return token


@catch_http_errors
async def get_playlists(authorization: str = Header(...)) -> JSONResponse:
    """Retrieve playlists from Spotify for the authenticated user.

    Args:
        authorization (str): Spotify authorization token.

    Returns:
        JSONResponse: JSON response containing the user's playlists.
    """
    token = await check_authorization(authorization)
    playlists = await spotify_service.get_playlists(token)
    return JSONResponse(content=playlists, status_code=200)


@catch_http_errors
async def generate_playlist(
    authorization: str,
    request: GeneratePlaylistRequest,  # noqa: B008
) -> JSONResponse:
    """Generate a playlist from Spotify based on similar tracks.

    Args:
        authorization (str): Spotify authorization token.
        request (GeneratePlaylistRequest): Request body containing the playlist ID and
            number of songs.

    Returns:
        JSONResponse: JSON response containing the generated playlist.

    Raises:
        HTTPException: If the original playlist does not have enough tracks.
    """
    token = await check_authorization(authorization)
    original_tracks = await spotify_service.fetch_all_tracks(token, request.playlist_id)
    if len(original_tracks) <= 10:
        raise HTTPException(
            status_code=500, detail="Playlist does not have enough tracks."
        )

    similar_tracks = await spotify_service.fetch_enough_similar_tracks(
        original_tracks, request.number_of_songs
    )
    spotify_tracks = await spotify_service.convert_to_spotify(token, similar_tracks)
    return JSONResponse(content=spotify_tracks, status_code=200)


@catch_http_errors
async def create_playlist(
    authorization: str = Header(...),
    request: GeneratePlaylistRequest = Body(...),  # noqa: B008
) -> None:
    """Placeholder for creating a playlist on Spotify.

    Args:
        authorization (str): Spotify authorization token.
        request (GeneratePlaylistRequest): Request body containing playlist details.

    Returns:
        None
    """
    pass


@catch_http_errors
async def callback(request: AuthCodeBody) -> dict:
    """Complete PKCE flow and get access token from Spotify.

    Args:
        request (AuthCodeBody): AuthCodeBody schema containing the code, redirect_uri,
            client_id, and code_verifier.

    Returns:
        dict: JSON response from Spotify containing the access token.
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
