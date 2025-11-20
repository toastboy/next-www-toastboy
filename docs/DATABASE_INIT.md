# Database Initialization

## Overview

The production stack uses a two-phase database initialization:

1. **Migrations** (automatic): Schema changes applied via `npx prisma migrate deploy`
2. **Seeding** (manual): Full data import from Azure Blob Storage

## Production Usage

### Normal Startup (migrations only)

```bash
docker compose -f docker-compose.prod.yml up -d
```

This will:

- Start the database
- Wait for it to be healthy
- Run pending migrations automatically
- Start the Next.js app

### First-Time Setup or Data Reset (with seed)

```bash
RUN_SEED=true docker compose -f docker-compose.prod.yml up -d
```

This will additionally:

- **Delete all existing data**
- Download JSON files from Azure Blob Storage
- Repopulate all tables

**⚠️ Warning**: Seeding wipes the database! Only use `RUN_SEED=true` when:

- Setting up a fresh database
- Intentionally resetting to production backup data
- Testing with known data sets

## Development Usage

Development already has its own workflow:

```bash
npm run dev  # Starts docker-compose.yml with local DB
```

For manual seeding in development:

```bash
npx prisma db seed
```

## Technical Details

- **Entrypoint**: `/docker/entrypoint.sh` handles initialization
- **Seed Config**: Defined in `prisma.config.ts`
- **Seed Script**: `prisma/seed.ts` downloads from Azure Blob Storage
- **Health Check**: Ensures DB is ready before migrations run

## Troubleshooting

**Migrations fail**:

```bash
docker compose -f docker-compose.prod.yml exec nodeapp npx prisma migrate status
```

**Force seed manually**:

```bash
docker compose -f docker-compose.prod.yml exec nodeapp npx prisma db seed
```

**Reset everything** (destroys data):

```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d
```
