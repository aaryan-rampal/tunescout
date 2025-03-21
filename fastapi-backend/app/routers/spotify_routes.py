from fastapi import APIRouter, Depends
from app.controllers import spotify_controller
from app.utils import get_spotify_token

router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
    dependencies=[Depends(get_spotify_token)],
    responses={404: {"description": "Not found"}},
)


@router.post("/spotify/get_playlists", tags=["spotify"])
async def get_playlists():
    return spotify_controller.get_user_playlists()


@router.post("/spotify/generate_playlist", tags=["spotify"])
async def generate_playlist():
    return spotify_controller.generate_playlist()


@router.post("/spotify/create_playlist", tags=["spotify"])
async def create_playlist():
    return spotify_controller.create_playlist()
