import pytest


@pytest.mark.asyncio
async def test_app_starts(client):
    resp = await client.get("/ping")
    assert resp.status_code == 200
    assert resp.json() == {"message": "pong"}
