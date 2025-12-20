import pytest
import asyncio


@pytest.mark.asyncio
async def test_register_creates_user_and_prevents_duplicates(client, user_payload):
    # 1) REgister --> success
    r1 = await client.post("/auth/register", json=user_payload)
    assert r1.status_code == 200, r1.text
    data = r1.json()
    assert "id" in data and isinstance(data["id"], int)
    assert data["email"] == user_payload["email"]
    assert data["username"] == user_payload["username"]
    assert "password" not in data
    assert "password_hash" not in data

    # 2) Register again with same email/username --> 400
    r2 = await client.post("/auth/register", json=user_payload)
    assert r2.status_code == 400, r2.text
    assert "already in use" in r2.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login_ok_and_not_ok(client, user_payload, register_user):
    # register_user runs firs because is a fixture dependency
    # 1) Login username
    r1 = await client.post(
        "/auth/login",
        json={
            "identifier": user_payload["username"],
            "password": user_payload["password"],
        },
    )
    assert r1.status_code == 200, r1.text
    data = r1.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # 2) Login email
    r2 = await client.post(
        "/auth/login",
        json={
            "identifier": user_payload["email"],
            "password": user_payload["password"],
        },
    )
    assert r2.status_code == 200, r2.text
    data = r2.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # 3) Wrong user
    r3 = await client.post(
        "/auth/login",
        json={
            "identifier": "wrong_user",
            "password": user_payload["password"],
        },
    )
    assert r3.status_code == 401, r3.text
    data = r3.json()
    assert "detail" in data
    assert data["detail"] == "Invalid Credentials"

    # 4) Wrong passowrd
    r4 = await client.post(
        "/auth/login",
        json={
            "identifier": user_payload["email"],
            "password": "wrong_password",
        },
    )
    assert r4.status_code == 401, r4.text
    data = r4.json()
    assert "detail" in data
    assert data["detail"] == "Invalid Credentials"


@pytest.mark.asyncio
async def test_refresh_token_happy_path_and_errors(client, auth_tokens):
    access_token_old = auth_tokens["access_token"]
    refresh_token = auth_tokens["refresh_token"]
    

    # 1) Happy path refresh
    await asyncio.sleep(1.8)
    rr = await client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert rr.status_code == 200, rr.text
    new_access = rr.json()["access_token"]
    assert isinstance(new_access, str) and len(new_access) > 20
    assert new_access != access_token_old
    
    # Validate refreshed access token actually works on a protected endpoint
    me = await client.get(
        "/users/me", headers={"Authorization": f"Bearer {new_access}"}
    )
    assert me.status_code == 200, me.text

    await asyncio.sleep(0.6)
    me2 = await client.get(
        "/users/me", headers={"Authorization": f"Bearer {access_token_old}"}
    )
    assert me2.status_code == 401

    # 2) After refresh token expiry, refresh should fail
    await asyncio.sleep(2.2)
    rr2 = await client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert rr2.status_code == 401, rr2.text
    assert "expired" in rr2.json()["detail"].lower()
    

    # 3) Missing refresh token
    rr3 = await client.post("/auth/refresh", json={})
    assert rr3.status_code == 400, rr3.text
    # 4) Wrong refresh token
    rr4 = await client.post("/auth/refresh", json={"refresh_token": "not-a-jwt"})
    assert rr4.status_code == 401, rr4.text
