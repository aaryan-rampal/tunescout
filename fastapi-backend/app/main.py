from fastapi import FastAPI, Depends
from app.routers import spotify_routes
from app.utils import get_spotify_token

app = FastAPI()
app = FastAPI(dependencies=[Depends(get_spotify_token)])
app.include_router(spotify_routes.router)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
