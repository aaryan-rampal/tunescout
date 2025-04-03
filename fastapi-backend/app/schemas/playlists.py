from typing import List

from pydantic import BaseModel


class Track(BaseModel):
    """Generic Pydantic model used throughout the API to represent a track.

    Args:
        BaseModel: Pydantic model.

    """

    name: str
    artists: List[str]
    uri: str
    image_url: str
    # TODO: should it be id?
    id: str


class GeneratePlaylistRequest(BaseModel):
    """Pydantic model used for spotify_router.generate_playlist().

    Args:
        BaseModel: Pydantic model.

    """

    playlist_id: str
    number_of_refreshes: int
    number_of_songs: int


class CreatePlaylistRequest(BaseModel):
    """Pydantic model used for spotify_router.create_playlist().

    Args:
        BaseModel: Pydantic model.

    """

    tracks: list[Track]
    name: str


class AuthCodeBody(BaseModel):
    client_id: str
    code: str
    code_verifier: str
    redirect_uri: str
