import pytest


@pytest.mark.asyncio
async def test_user_me(client, auth_headers, user_payload):
        # 1) Check if users me is there
        r = await client.get("/users/me", headers=auth_headers)
        assert r.status_code == 200, r.text
        data= r.json()
        assert data["email"] == user_payload["email"]
        assert "onboarding_completed" in data and isinstance(data["onboarding_completed"], bool)
        
        