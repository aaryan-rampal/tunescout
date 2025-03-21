from fastapi import APIRouter, Depends
from controllers import spotify_controller
from utils import get_token_header

router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@router.post("/spotify/get_playlists", tags=["spotify"])
async def get_playlists():
    spotify_controller.get_user_playlists()


@router.post("/spotify/generate_playlist", tags=["spotify"])
async def generate_playlist():
    spotify_controller.generate_playlist()


@router.post("/spotify/create_playlist", tags=["spotify"])
async def create_playlist():
    spotify_controller.create_playlist()
