import pytest
from httpx import ASGITransport, AsyncClient


@pytest.mark.asyncio
async def test_app_starts():
    from src.app.main import app
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("ping")
        assert resp.status_code == 200
        assert resp.json() == {"message": "pong"}