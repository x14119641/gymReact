from datetime import datetime, timedelta, timezone
from unittest.mock import Mock

import pytest


@pytest.fixture
def profile_payload():
    return {
        "goal": "strength",
        "days_per_week": "3",
        "experience_level": "beginner",
        "equipment_access": ["gym", "bodyweight"],
        "session_length": "60",
        "injuries": ["shoulder"],
        "sports_background": ["weights", "climbing"],
    }


@pytest.mark.asyncio
async def test_profile_me_empty(client, auth_headers):
    # 1) Check if profile me is there
    r = await client.get("/profile/me", headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data is None


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "injuries,sports_background",
    [
        (["shoulder"], ["weights"]),
        ([], ["weights"]),
        (["shoulder"], []),
        ([], []),
    ],
    ids=["both-provided", "empty-injuries", "empty-sports", "both-empty"],
)
async def test_onboarding_then_profile_me(
    client, auth_headers, profile_payload, injuries, sports_background
):
    profile_payload.update(injuries=injuries, sports_background=sports_background)
    r = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["goal"] == "strength"
    assert data["injuries"] == injuries
    assert data["sports_background"] == sports_background
    completed_at = data["onboarding_completed_at"]
    assert completed_at is not None

    r = await client.get("/profile/me", headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["days_per_week"] == profile_payload["days_per_week"]
    assert data["experience_level"] == profile_payload["experience_level"]
    assert data["onboarding_completed_at"] == completed_at

    me = await client.get("/users/me", headers=auth_headers)
    assert me.status_code == 200, me.text
    assert me.json()["onboarding_completed"] is True


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "field",
    ["goal", "days_per_week", "experience_level", "equipment_access", "session_length"],
)
async def test_onboarding_rejects_missing_required_fields(
    client, auth_headers, profile_payload, field
):
    del profile_payload[field]
    r = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    assert r.status_code == 422, r.text
    assert any(error["loc"] == ["body", field] for error in r.json()["detail"])

    profile = await client.get("/profile/me", headers=auth_headers)
    assert profile.status_code == 200, profile.text
    assert profile.json() is None


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "field,value",
    [
        ("goal", None),
        ("days_per_week", None),
        ("experience_level", None),
        ("equipment_access", None),
        ("session_length", None),
        ("equipment_access", "gym"),
        ("session_length", 60),
    ],
)
async def test_onboarding_rejects_invalid_required_fields(
    client, auth_headers, profile_payload, field, value
):
    profile_payload[field] = value
    r = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    assert r.status_code == 422, r.text
    assert any(error["loc"] == ["body", field] for error in r.json()["detail"])

    profile = await client.get("/profile/me", headers=auth_headers)
    assert profile.status_code == 200, profile.text
    assert profile.json() is None


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "field,value",
    [
        ("goal", ""),
        ("days_per_week", ""),
        ("experience_level", ""),
        ("equipment_access", []),
        ("session_length", ""),
    ],
)
async def test_empty_required_fields_do_not_record_completion(
    client, auth_headers, profile_payload, field, value
):
    profile_payload[field] = value
    r = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    # Empty values remain schema-valid, but do not satisfy completion requirements.
    assert r.status_code == 200, r.text
    assert r.json()["onboarding_completed_at"] is None

    profile = await client.get("/profile/me", headers=auth_headers)
    assert profile.status_code == 200, profile.text
    assert profile.json()["onboarding_completed_at"] is None


@pytest.mark.asyncio
async def test_onboarding_preserves_existing_completion_timestamp(
    client, auth_headers, profile_payload, monkeypatch
):
    from src.app.routers import profile as profile_router

    first_completion = datetime(2026, 1, 1, tzinfo=timezone.utc)
    clock = Mock()
    clock.now.return_value = first_completion
    monkeypatch.setattr(profile_router, "datetime", clock)

    created = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    assert created.status_code == 200, created.text
    assert (
        datetime.fromisoformat(created.json()["onboarding_completed_at"])
        == first_completion
    )

    clock.now.return_value = first_completion + timedelta(days=1)
    profile_payload.update(goal="mobility", injuries=[], sports_background=[])
    updated = await client.post(
        "/profile/onboarding", headers=auth_headers, json=profile_payload
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["goal"] == "mobility"
    assert (
        updated.json()["onboarding_completed_at"]
        == created.json()["onboarding_completed_at"]
    )

    profile = await client.get("/profile/me", headers=auth_headers)
    assert profile.status_code == 200, profile.text
    assert (
        profile.json()["onboarding_completed_at"]
        == created.json()["onboarding_completed_at"]
    )
