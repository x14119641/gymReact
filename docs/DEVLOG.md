# Dev Log


## 2025-12-21
- ImplementedGET /profiles/me
- Fixed multiple issues with access/refresh token handling
  - Identified refresh token expiration as root cause of random logouts
  - Stabilized auth flow during reloads and edge cases
  
Next:
- Gate app entry on onboarding completion
- Fix bug where user logs but user_profiles record for that user does not exists. Causes infinitu loading loop. Need to fix asap.


## 2025-12-20
- Finished onboarding flow (mobile)
- Added user_profiles table (backend)
- Migrated User model to SQLAlchemy 2.0 style
- Finished /profile route
- Added fixtures to conftest
- Re-done tests + test_users and test_profile

Next:
- ~POST /profile/onboarding~
- Gate app entry on onboarding completion
