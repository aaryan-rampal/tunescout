from pydantic import BaseModel
from typing import List

class Track:
    name: str
    artist: str
    uri: str
    # TODO: should it be id?
    id: str

class GeneratePlaylistRequest(BaseModel):
    playlist_id: str
    number_of_songs: int

class GeneratePlaylistRequest(BaseModel):
    tracks: List[Track]
    name: str
