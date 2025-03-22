from fastapi import APIRouter, Depends

from app.controllers import spotify_controller
from app.schemas.playlists import CreatePlaylistRequest, GeneratePlaylistRequest
from app.utils import get_spotify_token

router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
    dependencies=[Depends(get_spotify_token)],
    responses={404: {"description": "Not found"}},
)


@router.post("/spotify/get_playlists", tags=["spotify"])
async def get_playlists():  # noqa: D103
    return await spotify_controller.get_user_playlists()


@router.post("/spotify/generate_playlist", tags=["spotify"])
async def generate_playlist(request: GeneratePlaylistRequest):
    return await spotify_controller.generate_playlist(request)


@router.post("/spotify/create_playlist", tags=["spotify"])
async def create_playlist(request: CreatePlaylistRequest):
    return await spotify_controller.create_playlist(request)
