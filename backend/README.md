# BackEnd

FastAPI + SQAlquemy + Alembic + Postgres (docker)


## Environment (.env)
```bash
DATABASE_URL=

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=5432

JWT_SECRET=
JWT_ALG=
ACCESS_TOKEN_EXPIRE_SECONDS=
REFRESH_TOKEN_EXPIRE_SECONDS=
``` 
Note: Docker env in `backend/docker/` is not working well so i had them in the main `.env`.

## Run backend
```bash
PYTHONPATH=src uvicorn app.main:app --reload
```

## Keep up with Models and migrations (Very Important!)
Everytime i add a new model or i modify it:
```bash
PYTHONPATH=src alembic revision --autogenerate -m "describe your change"
PYTHONPATH=src alembic upgrade head
# Show current revision
alembic current
# Rollback last migration 
alembic downgrade -1
```


## Now we are using Docker image for postgres in order to avoid errors when upgrading arch
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
```

(We had to change the urls in settings to point the docker to 127.0.0.1)