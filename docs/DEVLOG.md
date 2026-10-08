# Dev Log

## 2026-10-08

- Continued working on the Freestyle Workout
  - Started implementing the active Workout Session
  - Added Zustand to manage the workout state
  - Created the types for `WorkoutSession`, `WorkoutExercise` and `WorkoutSet`
  - Added `startWorkout`, `addExercise` and `removeExercise`
  - For now everything is stored in memory, nothing is saved permanently

- Connected the Exercise Picker to the workout
  - Can now select multiple exercises
  - `Add exercises` adds the selected exercises to the active session
  - Going back to Freestyle shows the exercises that were added
  - Fixed an issue with `crypto.randomUUID()` on Android using `expo-crypto`

- Updated the Freestyle Workout screen
  - Replaced the previous exercise cards with a table
  - Added columns for Exercise, Sets, Reps and Rest
  - Added a small image placeholder for each exercise
  - The values are still empty since the exercise configuration is not implemented yet
  - Kept the Add Exercise button below the list
  - Added a Complete Workout button, not functional yet

- Exercise management
  - Added a three-dot button to each exercise row
  - Can remove an exercise from the active workout
  - Added a confirmation before removing it
  - Tested adding and removing exercises in the Android emulator
  - Seems to be working fine for now

- Next:
  - Make Sets, Reps and Rest editable
  - Connect the exercise configuration to Zustand
  - Start logging actual sets with weight and repetitions
  - Update the Freestyle table when the exercise configuration changes
  - Eventually implement completing and saving workouts
  - Review the small UI/cleanup issues left from the previous days
  - 
## 2026-10-07

- Continued the Exercise Picker
  - Moved the mock exercise list to `src/mocks/exercises.mock`
  - Expanded the mock library with more exercises
  - Added Muscle and Equipment data to the exercises
  - Search now filters the exercise list
  - Added Muscle and Equipment filter buttons
  - Filters can work together with search
  - Decided not to add a Type filter for now

- Created `FilterSelectModal`
  - Reusable for both Muscle and Equipment
  - Shows the available filter options
  - Selecting an option updates the exercise list
  - `All` clears the filter
  - Modal styling/dismiss behaviour still needs some work

- Exercise navigation
  - Added a generic exercise page/template
  - Exercise rows can open the exercise page
  - Decided exercises should be data, not separate React components/pages
  - Later the exercise page should receive an exercise ID and load the corresponding exercise
  - `+` will eventually add the selected exercise to the current workout instead of opening its information page

- Workout structure / ideas
  - Workout tab should eventually be a landing page for saved routines/programs, not the Exercise Library
  - A Routine is a reusable workout template
  - A Program can organize/schedule multiple routines
  - A Workout Session is the actual workout performed on a particular day
  - Freestyle creates an empty Workout Session
  - Keep the current `workout/` route structure for now

- Reviewed the current frontend structure with Codex
  - Current route/component structure is generally OK
  - Keep `ExerciseContainer` and `ExercisePickerRow` separate
  - Generic `Container` is still useful, but some usages can probably become normal `View`s
  - Possible future rename from `Container` to `SurfaceCard`
  - Found a few small UI/interaction/cleanup issues to review later
  - No large refactor needed

- Next:
  - Finish/polish `FilterSelectModal`
  - Review the small issues found in the frontend review
  - Small `Container` cleanup if it still makes sense
  - Pass exercise identity to the exercise page
  - Make `+` actually add an exercise to the Freestyle Workout
  - Decide the simplest local state for the active Workout Session
  - Start experimenting with sets/reps/weight/rest logging
  
## 2026-10-06

- Started building the Freestyle Workout page
  - Added the workout title/date
  - Created `ExerciseContainer`
  - For now it shows:
    - exercise image/placeholder
    - exercise name
    - short summary (`3×10 · 20kg · 2 min rest`)
    - options button
  - Added some mock exercises to test the layout
  - Added `+ Add Exercise`
  - Tested the design in light/dark mode
  - Using the neon/highlight color mainly for actions/accents

- Started the Exercise Picker
  - Added `exercise-picker.tsx` inside the Workout stack
  - `+ Add Exercise` opens the picker
  - Back returns to the Freestyle Workout
  - Created a smaller `ExercisePickerRow`
    - image/placeholder
    - exercise name
    - `+` button
  - Added around 10 fake exercises to see how a longer list looks
  - Tried `ScrollView`, then changed to `FlatList`
  - Removed the big `Container` around the list because it looked too heavy
  - List/header scrolling still needs some adjustment

- Some decisions/ideas
  - `ExerciseContainer` is for an exercise already in the workout
  - `ExercisePickerRow` is for choosing an exercise from the library
  - Don't build the backend/database yet
  - First figure out how exercise logging should work
  - Exercise page will probably need sets/reps/weight/rest plus previous history
  - Not every exercise will use the same data (weight/reps, bodyweight, time, assisted, etc.)
  - Would like exercise images and possibly videos/YouTube links later
  - Keep the design open for supersets, but don't implement them yet

- Next:
  - Fix the picker scrolling/header
  - Add the search bar
  - Search/filter the mock exercises
  - Make `+` actually add an exercise to the Freestyle Workout
  - Start experimenting with sets/reps logging
  
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

- Validation / TypeScript cleanup
  - Fixed the 5 active TypeScript errors in OnboardingReview.tsx
    - Updated stale snake_case field references to the current camelCase onboarding model
    - No onboarding types or behavior were changed
  - Excluded the archived app-example Expo starter code from TypeScript checking
    - app-example is not part of the active application
  - Active application TypeScript checks now pass
  - ESLint checks passed for migrated theme files
  - git diff --check passed

- Started Add Workout / Work Session flow
  - Added a floating `+` action to Home
  - Added an Add Work Session bottom sheet
  - Added current date to the Add Work Session sheet
  - Initial activity choices:
    - Freestyle Workout
    - Saved Routines
    - Measurements
    - Cardio
  - Freestyle Workout is the first functional activity choice
  - Other activity choices are currently UI placeholders

- Added initial Freestyle Workout navigation
  - Added a dedicated Freestyle Workout screen
  - Added a nested Stack under the existing Workout tab
  - Workout tab can now contain multiple screens while preserving the bottom tab navigation
  - Current structure:
    - workout/index.tsx remains the Workout landing area
    - workout/freestyle.tsx is the initial active-workout screen
    - workout/_layout.tsx manages navigation within the Workout section
  - Home can navigate directly to Freestyle Workout from the Add Work Session sheet
  - Kept the root authentication/navigation gate unchanged after moving the workout flow inside `(tabs)`

- Clarified initial workout domain direction
  - A freestyle workout should create a WorkoutSession rather than a reusable Routine
  - Routine represents a reusable workout definition/template
  - WorkoutSession represents an actual workout performed on a particular day
  - Starting from a Routine should eventually create a WorkoutSession initialized from that routine
  - Completed sessions must remain historical snapshots and must not depend on later Routine changes
  - A freestyle session may optionally be saved as a Routine later
  - Future exercise grouping should leave room for supersets without assuming one UI card always equals one exercise

- Workout UX direction
  - Workout tab landing page may eventually contain:
    - Saved routines
    - Programs/plans
    - Exercise library
    - Custom exercise creation
  - Home `+` remains the quick-entry action for starting/logging activity
  - Initial Freestyle Workout screen will be developed incrementally
  - Planned workout information includes:
    - Exercises
    - Workout notes
    - Completed-workout overview
    - Duration
    - Training volume
    - Performance / personal-best information
    - Per-workout difficulty/effort rating
  - Exercise picker direction:
    - Search/browse exercises
    - Muscle/exercise visual
    - Quick `+` selection
    - Exercise detail/history view
    - Support selecting multiple exercises before returning to the workout
  - Do not implement supersets, persistence, exercise history, or backend workout models yet

- Next:
  - Design the empty Freestyle Workout screen
  - Add the initial `+ Add Exercise` action
  - Build a small mocked exercise picker
  - Use the first exercise card to validate the frontend/domain model before designing backend tables or APIs
  - Keep theme and authentication foundation frozen unless a functional issue is found
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
