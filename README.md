# Next.js + Postgres

[![Deploy to Inferra](https://inferralab.com/assets/deploy-to-inferra.svg)](https://github.com/new?template_owner=inferra-AI&template_name=template-nextjs-postgres)

A minimal App Router page lists the newest 100 notes from Postgres. The first page request creates the `notes` table. `/api/health` checks database connectivity.

## Deploy

1. Click **Deploy to Inferra** or **Use this template** to create your repository with a `main` branch.
2. Install the Inferra GitHub App and grant it access to your new repository.
3. Add the database to your account repository (below), then push to `main`. Inferra builds with buildpacks and deploys the app.

This repository uses Inferra configuration version 3:

- `.inferra/repo.yaml` says which branches run (only `main`).
- `.inferra/app.yaml` says how the `web` app builds and runs, and binds the service named `db`.

### Add the database to your account repository

Services are declared once per account, in your private `<account>/.inferra` repository, not in this repository. Add `services/notes-db.yaml` there (any file name works) and replace `template-nextjs-postgres` under `attach:` with your repository's name:

```yaml
version: 3
name: db
type: postgres
hosting: native
data: dedicated
cpu: 0.25
memory: 256Mi
storage: 1Gi
attach:
  template-nextjs-postgres:   # your repository's name
    branches: [main]
    access: readwrite
```

The app binds `db`, so Inferra gives it `DB_URL`. If your account repository has an `account.yaml`, also list this repository under `repos:` with a quota. Keep credentials out of configuration files.

## Local run

Use Node.js 22 and Docker Compose. Start local dependencies and copy the environment example:

```sh
docker compose up -d
cp .env.example .env
# These sample credentials are only for the local database.
set -a
. ./.env
set +a
npm ci
npm run dev
# Open http://localhost:3000
# Production: npm run build && npm start
```

Wait until Postgres is ready if the first request fails. Variables must be exported in every terminal used to start an app. `docker compose down` stops local services; `docker compose down -v` also removes local data.

Add a note after loading the page:

```sh
docker compose exec db psql -U starter -d starter -c "INSERT INTO notes (body) VALUES ('Hello Inferra');"
```

Refresh the page to see it. No database is needed during `npm run build`; pages query it at request time.

## Files

- `.inferra/repo.yaml`: branches that run.
- `.inferra/app.yaml`: process, port, health check, build settings and service binding.
- `Procfile`: buildpack process commands.
- `compose.yaml`: pinned local Postgres container and database volume.
- `.env.example`: local environment values; copy to ignored `.env`.
- `.gitignore`: keeps local credentials and generated files out of Git.
- `app/layout.js`: HTML layout and title.
- `app/page.js`: dynamic, server-rendered notes list.
- `app/api/health/route.js`: database readiness endpoint.
- `lib/db.js`: lazy connection pool and first-request table creation.
- `next.config.mjs`: limits build concurrency for small build machines.
- `package.json` and `package-lock.json`: pinned direct dependencies, locked dependency tree, and run/build commands.
- `LICENSE`: MIT license.
- `README.md`: deployment and local instructions.
