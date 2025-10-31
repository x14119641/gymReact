BackEnd

Login, API's, Database Interactions so far.

# Set Variables .env Files (Already done)
Such as DATABASE_URL, JWT_SECRET, JWT_ALG, ACCESS_TTL_MIN

# Run backend
```PYTHONPATH=src uvicorn app.main:app --reload```

# Keep up with Models and migrations (Very Important!)
Everytime i add a new model or i modify it:
```
PYTHONPATH=src alembic revision --autogenerate -m "describe your change"
PYTHONPATH=src alembic upgrade head
```

# Show current DB revision
```alambic current```

# Rollback last migration 
```alembic downgrade -i```