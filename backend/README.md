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

# Now we are using Docker image for postgres in order to avoid errors when upgrading arch
```bash
# Start in background (recommended)
docker compose up -d

# Start in foreground (logs attached)
docker compose up

# Stop containers (keeps data volume)
docker compose down

# Connect to docker
docker exec -it app-postgres psql -U 'pwd' -d db_dev 

# Query docker
docker exec -it app-postgres psql -U 'pwd' -d db_dev -c "YOUR QUERY HERE"

# from host
psql "postgresql://username:pwd@127.0.0.1:5432/db_dev" -c "SELECT count(*) FROM users;" 

# Check logs
docker logs --tail 80 app-postgres
``

**Need to add the variables env!! ( in mi /docker/.env is not workig i dont know why)**


(We had to change the urls in settings to point the docker to 127.0.0.1)