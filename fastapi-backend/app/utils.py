from fastapi import Header, HTTPException


async def get_spotify_token(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing Bearer token")
    return authorization.split(" ")[1]


def catch_http_errors(func):
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except HTTPException as e:
            print(str(e))
            raise
        except Exception as e:
            print("❌ Other error:", str(e))
            raise

    return wrapper
