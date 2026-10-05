# Dev Log

## 2026-10-05

- Refactored frontend theme architecture
  - Kept the existing ThemeProvider / useTheme architecture
  - Introduced semantic light/dark theme tokens:
    - background / surfaces
    - text / muted text
    - primary interaction colors
    - borders
    - success / warning / danger
    - highlight colors
  - Removed the unused legacy palette.ts
  - Removed the old experimental console theme after migrating its active consumers
  - Kept temporary compatibility aliases where Login/Register still depend on them

- Migrated shared UI components to semantic theme colors
  - BaseLayout
  - Container
  - Card
  - HeroStatsCard
  - SettingRow
  - WeekDays
  - Bottom tab navigation
  - Calendar
  - Profile

- Updated selected date styling
  - Removed old cyan / console-style selected states
  - WeekDays and Calendar now use the same semantic treatment:
    - surfaceSecondary fill
    - primary border
    - text foreground
  - Preserved all existing date selection and navigation behavior

- Added functional Dark Mode toggle to Profile
  - Uses the existing ThemeProvider directly
  - Switches between light and dark modes immediately
  - No additional Zustand store or context
  - No persistence yet; theme selection is session-only
  - Existing system-theme support remains available in ThemeProvider

- Updated Profile theme styling
  - Migrated remaining active Profile colors to semantic tokens
  - Restyled Logout from a large dark/red button to a neutral surface with danger-colored text/icon
  - Fixed dark-mode white borders around Profile caused by ScrollView margins exposing React Navigation's default background
  - Added a themed full-size wrapper without changing Profile layout

- Manually verified in emulator:
  - Light theme
  - Dark theme
  - Theme switching
  - Home
  - Profile
  - WeekDays
  - Bottom navigation
  - Selected dates no longer use the old cyan styling
  - Dark Profile background renders correctly

- Validation:
  - Theme changes introduced no new TypeScript errors
  - ESLint checks passed for migrated files
  - git diff --check passed
  - 38 pre-existing TypeScript errors remain:
    - 33 in app-example
    - 5 in OnboardingReview.tsx

- Next:
  - Fix the 5 active OnboardingReview.tsx TypeScript errors
  - Decide whether app-example should be removed/excluded rather than fixing unused starter code
  - Freeze theme/foundation work
  - Start Add Workout flow
    - Add workout from WeekDays
    - Display workout sessions below WeekDays
    - Support multiple sessions per day
    - 
## 2026-10-02
- Reviewed and stabilized auth/onboarding edge cases
  - Fixed onboarding payload mismatch between frontend camelCase fields and backend snake_case schema
  - Fixed startup refresh flow accidentally discarding the existing refresh token when the backend returns only a new access token
  - Verified refresh-token preservation

- Fixed onboarding completion metadata
 - onboarding_completed_at is now set when all required onboarding fields are completed
 - Optional injuries and sports_background can be empty without preventing onboarding completion
 - Added session_length to the completion condition
 - Existing completion timestamps are preserved
 - Added focused backend tests: 23 profile tests passing

- Manually verified:
 - Existing user without user_profiles record → Onboarding
 - New user can complete onboarding while skipping optional fields
 - Successful onboarding creates/updates profile and sets onboarding_completed_at
 - Completed user → Home
 - Token/session restoration still works

- Architecture / behavior confirmed:
 - Current routing uses profile existence (missing / ready) to decide between Onboarding and Home
 - onboarding_completed_at is not currently used as the routing gate
 - Old profiles with onboarding_completed_at = NULL may still enter Home because historical NULL values are ambiguous
 - No backfill performed for old profile records

- Known UX issue:
 - On app reload, Login may briefly render before the authenticated app
 - Confirmed as a routing/render timing issue rather than a failed refresh
 - Deferred because authentication/session restoration works correctly

- Next:
 - Freeze auth/onboarding work unless a new functional bug appears
 - Continue Profile UI / settings
 - Start Add Workout flow
 - Add workout from WeekDays
 - Display workout sessions below WeekDays
 - Support multiple sessions per day
 - Later: decide whether onboarding_completed_at / onboarding_completed should become the routing source of truth

## 2026-03-26
- Created Profile Page and added a "SettignsRow" Component where data is shown.
  - Defined clean structure for Settings
  - 
- Next:
  - Start the Add Workout flow
    - User adds a workout via the WeekDays button
    - A workout session appears under WeekDays as a card / row
    - Support multiple sessions per day (2–3 workouts)
- Polish Profile
  - Include settings and plan
  
- Known Bug
  - When opening the app, app shows login page, loading and then enters to home page due refreshToken.
  - App still loading even if refresh token did expire.


## 2026-01-29
- Calendar Modal
  - Created icon in weekdays to open Calendar
  - Created Calendar modal, works ok. Uses mock data.

- Next:
  - Start the Add Workout flow
    - User adds a workout via the WeekDays button
    - A workout session appears under WeekDays as a card / row
    - Support multiple sessions per day (2–3 workouts)
- Polish Profile
  - Include settings and plan
  - Define clean structure for both
- No back end work (fronend-only focus)
  
- Known Bug
  - When opening the app, app shows login page, loading and then enters to home page due refreshToken. 


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
