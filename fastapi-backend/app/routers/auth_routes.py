from fastapi import APIRouter

from app.controllers import spotify_controller
from app.schemas.playlists import AuthCodeBody

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/callback", tags=["auth"])
async def callback(request: AuthCodeBody):
    return await spotify_controller.callback(request)
