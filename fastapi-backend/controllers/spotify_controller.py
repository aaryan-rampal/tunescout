from fastapi import Header, HTTPException
from services import spotify_service


async def get_user_playlists(authorization: str = Header(None)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid token format")

    token = authorization.split(" ")[1]
    playlists = await spotify_service.get_user_playlists(token)
    return playlists


async def generate_playlist(authorization: str = Header(None)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid token format")
    pass


async def create_playlist():
    pass
