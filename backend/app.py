from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from httpx import AsyncClient
from cache import CacheService


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http_client = AsyncClient(http2=True)
    app.state.cache_service = CacheService(app.state.http_client)
    yield
    app.state.cache_service = None
    await app.state.http_client.aclose()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5001",
    "http://127.0.0.1:5001",
]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET"])
