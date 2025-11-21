# Database Initialization

## Overview

The production stack separates build, runtime, and data operations:

1. **Migrations** (via seeder): Schema changes applied before seeding via `npx prisma migrate deploy`
2. **Seeding** (manual, separate service): Full data import from Azure Blob Storage

## Architecture

- **Production runtime (`nodeapp`)**: Minimal dependencies, runs Next.js only (no migration logic)
- **Seeder service**: Separate container with dev dependencies; atomically runs migrations **then** seed
- **Seed script**: Reads directly from environment variables (no secrets abstraction needed)
- **Migration strategy**: All migrations handled by seeder before data import, ensuring schema correctness

## Production Usage

### Normal Startup (migrations only)

```bash
docker compose -f docker-compose.prod.yml up -d
```

This will:

- Start the database
- Wait for it to be healthy
- Start the Next.js app (without running migrations)

**Note**: This assumes migrations have already been run via the seeder, or you're starting with a fresh database that will be seeded later.

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
- **Runs migrations first** to ensure schema is current
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

- **Runtime**: `nodeapp` runs Next.js directly—no migrations at startup (handled by seeder instead)
- **Seeder Script**: `/scripts/docker/seeder.sh` runs `prisma migrate deploy` → `prisma db seed` atomically
- **Seed Config**: Defined in `prisma.config.ts`
- **Seed Source**: `prisma/seed.ts` reads from `process.env` directly (no secrets.ts dependency)
- **Seeder Service**: Uses `seeder` build stage with dev dependencies included
- **Profile**: Seeder uses `profiles: [seed]` so it doesn't auto-start with `up -d`
- **Health Check**: Ensures DB is ready before seeder or nodeapp start

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
