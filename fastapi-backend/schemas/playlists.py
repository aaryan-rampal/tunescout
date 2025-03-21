from pydantic import BaseModel


class GeneratePlaylistRequest(BaseModel):
    playlist_id: str
    number_of_songs: int
