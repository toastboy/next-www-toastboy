#!/bin/sh
set -e

export DATABASE_URL="mysql://root:$MYSQL_ROOT_PASSWORD@db:3306/footy"

echo "Running database migrations..."
if ! npx prisma migrate deploy 2>&1; then
    echo "ERROR: Database migration failed"
    exit 1
fi

if [ "$RUN_SEED" = "true" ]; then
    echo "RUN_SEED is true, running database seed..."
    if ! npx prisma db seed 2>&1; then
        echo "ERROR: Database seed failed"
        exit 1
    fi
else
    echo "Skipping database seed (set RUN_SEED=true to enable)"
fi

echo "Starting Next.js application..."
exec "$@"
