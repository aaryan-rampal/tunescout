from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth_routes, spotify_routes

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for all (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spotify_routes.router)
app.include_router(auth_routes.router)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
