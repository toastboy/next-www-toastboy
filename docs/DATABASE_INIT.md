# Database Initialization

## Overview

The production stack separates build, runtime, and data operations:

1. **Migrations** (automatic at startup): Schema changes via `npx prisma migrate deploy`
2. **Seeding** (manual, separate service): Full data import from Azure Blob Storage

## Architecture

- **Production runtime (`nodeapp`)**: Minimal dependencies, only runs Next.js app + migrations
- **Seeder service**: Separate container with dev dependencies for TypeScript seed script
- **Seed script**: Reads directly from environment variables (no secrets abstraction needed)

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

Seeding is now a separate operation using a dedicated service:

```bash
# Start the stack (without seed)
docker compose -f docker-compose.prod.yml up -d

# Run the seeder (one-time operation)
docker compose -f docker-compose.prod.yml run --rm seeder
```

The seeder:

- Runs in a separate container with dev dependencies
- **Deletes all existing data**
- Downloads JSON files from Azure Blob Storage
- Repopulates all tables
- Exits when complete

**⚠️ Warning**: Seeding wipes the database! Only use when:

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

- **Entrypoint**: `/docker/entrypoint.sh` runs migrations only (no seeding logic)
- **Seed Config**: Defined in `prisma.config.ts`
- **Seed Script**: `prisma/seed.ts` reads from `process.env` directly (no secrets.ts dependency)
- **Seeder Service**: Uses `seeder` build stage with dev dependencies included
- **Profile**: Seeder uses `profiles: [seed]` so it doesn't start with `up -d`
- **Health Check**: Ensures DB is ready before migrations/seeding run

## Troubleshooting

**Seeder fails to connect**:

```bash
# Check if database is healthy
docker compose -f docker-compose.prod.yml ps

# Check seeder has environment variables
docker compose -f docker-compose.prod.yml run --rm seeder env | grep AZURE
```

**Migrations fail**:

```bash
docker compose -f docker-compose.prod.yml exec nodeapp npx prisma migrate status
```

**Force seed manually**:

```bash
docker compose -f docker-compose.prod.yml run --rm seeder
```

**Rebuild seeder after changes**:

```bash
docker compose -f docker-compose.prod.yml build seeder
```

**Reset everything** (destroys data):

```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d
```
