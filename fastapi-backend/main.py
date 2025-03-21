from fastapi import FastAPI, Depends
from .routers import spotify_routes
from .utils import get_query_token

app = FastAPI()
app = FastAPI(dependencies=[Depends(get_query_token)])
app.include_router(spotify_routes.router)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}

