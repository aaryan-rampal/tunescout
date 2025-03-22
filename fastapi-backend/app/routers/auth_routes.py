from fastapi import APIRouter, Depends

from app.controllers import spotify_controller

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/callback", tags=["auth"])
async def callback(code: str, code_verifier: str, redirect_uri: str):
    return spotify_controller.callback(code, code_verifier, redirect_uri)

