from typing import Dict, List

from fastapi import APIRouter, Depends, Header

from app.controllers import spotify_controller
from app.schemas.playlists import (
    CreatePlaylistRequest,
    GeneratePlaylistRequest,
    Track,
)
from app.utils import get_spotify_token

router = APIRouter(
    prefix="/spotify",
    tags=["spotify"],
    dependencies=[Depends(get_spotify_token)],
    responses={404: {"description": "Not found"}},
)


@router.post("/get_playlists", tags=["spotify"], response_model=List[Dict])
async def get_playlists(authorization: str = Header(...)):  # noqa: D103
    return await spotify_controller.get_playlists(authorization)


@router.post("/generate_playlist", tags=["spotify"], response_model=List[Track])
async def generate_playlist(
    request: GeneratePlaylistRequest, authorization: str = Header(...)
):
    return await spotify_controller.generate_playlist(authorization, request)


@router.post("/create_playlist", tags=["spotify"])
async def create_playlist(request: CreatePlaylistRequest):
    return await spotify_controller.create_playlist(request)
