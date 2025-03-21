from fastapi import FastAPI

from app.routers import spotify_routes

app = FastAPI()
app.include_router(spotify_routes.router)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
