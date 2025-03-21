from fastapi import Header, HTTPException
from app.services import spotify_service


async def get_user_playlists(authorization: str = Header(None)):
    pass


async def generate_playlist(authorization: str = Header(None)):
    pass


async def create_playlist():
    pass
