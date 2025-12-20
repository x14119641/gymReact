import pytest


@pytest.mark.asyncio
async def test_profile_me_empty(client, auth_headers):
    # 1) Check if profile me is there
    r = await client.get("/profile/me", headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data is None


@pytest.mark.asyncio
async def test_onboarding_then_profile_me(client, auth_headers):
    # 1) Create onboarding data
    profile_payload = {
        "goal": "strength",
        "days_per_week": "3",
        "experience_level": "beginner",
        "equipment_access": ["gym", "bodyweight"],
        "session_length": "3",
        "injuries": [
            "shoulder",
        ],
        "sports_background": ["weights", "climbing"],    }
    r = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["goal"] == "strength"
    assert len(data["injuries"]) == 1
    assert "onboarding_completed_at" in data
    assert isinstance(data["sports_background"], list)
    
    # ") So now me should be working"
    r = await client.get("/profile/me", headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["days_per_week"] == profile_payload["days_per_week"]
    assert data["experience_level"] == profile_payload["experience_level"]
    assert "onboarding_completed_at" in data