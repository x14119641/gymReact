# gymReact

Mobile app + FastAPI backend for workout tracking.
Goal: track workouts, support onboarding metadata, later AI guided programming (kind of a coach reviewing your training)

## Architecture
- `mobile/` Expo (React Native)
- `backend/` FastAPI + SQALchemy + Alembic
- Postgres via Docker
- `web/`  - (planned) marketing / dashboard / data import

## Current status
- [x] Mobile onboarding flow (goal, days/week, experience, equipment, injuries, sports, session length + review)
- [x] Backend: users + user_profiles table + Alembic migrations
- [x] Backend endpoint: POST /profile/onboarding
- [ ] Backend endpoint: GET /me includes onboarding_completed
- [ ] Mobile: gate app based on onboarding completion
- [ ] Profile screen (view / edit onboarding data)
- [ ] User measurements (weight, etc.)
- [ ] User lifestyle (job, age, average sittign or whatever is good here and is comfortable to ask the user)
- [ ] ...
- [ ] Web: Branding web, download apk, connect to market, csv templates to import data "manually"
  
  ## Next milestone
  1) POST onboarding payload to backend on Finish
  2) Add onboarding_comleted flag (Avoid ask for onboarding when login if user already completed that task)
  3) Add profile screen (frontend + backend)
  4) Add extended user metadata (lifestyle)
  5) Add `user_measurements` model (time-series)
  6) Connect profile + measurements to workouts 
  7)  


## Quick start
See `backend/README.md` and `mogile/README.md` 

## Docs
- Backend: `backend/README.md`
- Mobile: `mobile/README.md`