from fastapi import Header, HTTPException


async def get_spotify_token(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing Bearer token")
    return authorization.split(" ")[1]
