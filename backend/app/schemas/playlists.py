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
    similarity: float = 0.0
    runtime: int = 0

    # class Config:
    #     from_attributes = True
    model_config = {
        "from_attributesjson_schema_extra": {
            "example": {
                "name": "Track Name",
                "artists": ["Artist 1", "Artist 2"],
                "uri": "spotify:track:1234567890abcdef",
                "image_url": "https://example.com/image.jpg",
                "id": "1234567890abcdef",
                "similarity": 0.85,
                "runtime": 240000,  # in milliseconds
            }
        }
    }


class GeneratePlaylistRequest(BaseModel):
    """Pydantic model used for spotify_router.generate_playlist().

    Args:
        BaseModel: Pydantic model.

    """

    playlist_id: str
    number_of_refreshes: int
    number_of_songs: int


def GeneratePlaylistResponse(BaseModel):
    """Pydantic model used for spotify_router.generate_playlist() response.

    Args:
        BaseModel: Pydantic model.

    """

    tracks: List[Track]


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
