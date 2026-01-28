# Dev Log

## 2026-01-28
- NAvigation / App structure
  - Simplified bottom tav navigation to Home / Worjout / Progress / Profile
  - Removed unusued screens (about, settings, newPage) from the main tab flow
  - Created placeholder for WOrkout and Progress screens
  - Aligned Expor Router structure with intended user journey
- UX / Architecture Decisions
  - Home -> heroStats, weekdays (today selected), quick actions
  - Workout -> Session editind and history
  - PRogress -> Future analytics and trends
  - Profile -> user info, plans, settings   

- Next:
  - Think about calendar "panel" in weekdays
  - Start the Add Workout flow
    - User adds a workout via the WeekDays button
    - A workout session appears under WeekDays as a card / row
    - Support multiple sessions per day (2–3 workouts)
- Polish Profile
  - Include settings and plan
  - Define clean structure for both
- No back end work (fronend-only focus)


## 2026-01-20
- ImplementedGET /profiles/me
- Fixed critical onboarding gate bug
  - Root cause: users without profile_user record caused infinite loop
- Stabilized auth + routing integration
  - Fixed infinite loops caused by redirects in RootLayout
  - Properly declared (onboarding) route group to avoid router warnings
  - Created index files when missing
- HArdened acces /refresh token hadnling
  - Restricted refresh logic to 401 only (no refresh in 403)
  - Prevented refresh attempts on auth endpoints
- Confirmed correct behaviur for:
  - New users
  - Existing users tuwhout profile records
  - logout
  - Token refresh during active sessions

- UX LIMITATION
  - On full app reload (r, after run npx start expo) the screen goes to loading, login, and then the user (due refresh token). I will accept this for now   
  
Next:
- Not sure, perhaps some clean/refactoring.
- Start to think in home page, and some screens i will ned, for example "today", workouts and i guess polish profiles and settings.


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
