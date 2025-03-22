import httpx
from fastapi import Body, Header, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.playlists import AuthCodeBody, GeneratePlaylistRequest
from app.services import spotify_service


async def check_authorization(authorization: str):
    if not authorization:
        raise HTTPException(status_code=400, detail="Authorization header is required")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization format")

    token = authorization.removeprefix("Bearer ").strip()
    return token


async def get_playlists(authorization: str = Header(...)):
    token = await check_authorization(authorization)
    print(f"got token {token}")
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
