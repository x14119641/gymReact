import pytest 



@pytest.mark.asyncio
async def test_register_creates_user_and_prevents_duplicates(client):

        payload = {
            "email": "test1@test.com",
            "username": "testuser1",
            "password": "supersecret"
        }
        
        # 1) REgister --> success
        r1 = await client.post("/auth/register", json=payload)
        assert r1.status_code == 200, r1.text
        data = r1.json()
        assert "id" in data and isinstance(data["id"], int)
        assert data["email"] == payload["email"]
        assert data["username"] == payload["username"]
        assert "password" not in data
        assert "password_hash" not in data
        
        # 2) Register again with same email/username --> 400
        r2 = await client.post("/auth/register", json=payload)
        assert r2.status_code == 400, r2.text
        assert 'already in use' in r2.text