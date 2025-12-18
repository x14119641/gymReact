import pytest 
import asyncio



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
        assert "already in use" in r2.json()["detail"].lower()
        

@pytest.mark.asyncio
async def test_login_ok_and_not_ok(client):
    # 1) Test username
    payload = {
            "identifier": "testuser1",
            "password": "supersecret"
        }
    r1 = await client.post("/auth/login", json=payload)
    assert r1.status_code == 200, r1.text
    data = r1.json()
    assert 'access_token' in data
    assert 'refresh_token' in data
    
    # 2) Test email
    payload = {
            "identifier": "test1@test.com",
            "password": "supersecret"
        }
    r2 = await client.post("/auth/login", json=payload)
    assert r2.status_code == 200, r2.text
    data = r2.json()
    assert 'access_token' in data
    assert 'refresh_token' in data
    
    # 3) Wrong user
    payload = {
            "identifier": "wronguser",
            "password": "supersecret"
        }
    r3 = await client.post("/auth/login", json=payload)
    assert r3.status_code == 401, r3.text
    data = r3.json()
    assert 'detail' in data
    assert data ['detail'] == "Invalid Credentials"
    
    # 4) Wrong passowrd
    payload = {
            "identifier": "test1@test.com",
            "password": "wrongpassword"
        }
    r4 = await client.post("/auth/login", json=payload)
    assert r4.status_code == 401, r4.text
    data = r4.json()
    assert 'detail' in data
    assert data ['detail'] == "Invalid Credentials"
    
    
@pytest.mark.asyncio
async def test_refresh_token_happy_path_and_errors(client):
    reg = {"email": "r1@test.com", "username": "ruser1", "password": "supersecret"}
    r0 = await client.post("/auth/register", json=reg)
    assert r0.status_code == 200, r0.text
    
    login = await client.post("/auth/login", json={"identifier":"ruser1","password": "supersecret"})
    assert login.status_code == 200, login.text
    tokens = login.json()
    refresh_token = tokens["refresh_token"]
    access_token_old= tokens["access_token"]
    
    # 1) Happy path refresh
    await asyncio.sleep(1)
    rr = await client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert rr.status_code == 200, rr.text
    new_access = rr.json()["access_token"]
    assert isinstance(new_access, str) and len(new_access)>20

    
    # Validate refreshed access token actually works on a protected endpoint
    me = await client.get("/users/me", headers={"Authorization": f"Bearer {new_access}"})
    assert me.status_code == 200, me.text
    
    await asyncio.sleep(1)
    me2 = await client.get("/users/me", headers={"Authorization": f"Bearer {access_token_old}"})
    assert me2.status_code == 401
    
    # 2) After refresh token expiry, refresh should fail
    await asyncio.sleep(2)
    rr = await client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert rr.status_code == 401, rr.text
    assert'expired' in rr.json()["detail"]
    
    # 3) Missing refresh token
    rr2 = await client.post("/auth/refresh", json={})
    assert rr2.status_code == 400, rr2.text
    # 4) Wrong refresh token
    rr3 = await client.post("/auth/refresh", json={"refresh_token": "not-a-jwt"})
    assert rr3.status_code == 401, rr3.text
    