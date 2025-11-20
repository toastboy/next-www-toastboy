#!/bin/sh
set -e

export DATABASE_URL="mysql://root:$MYSQL_ROOT_PASSWORD@db:3306/footy"

echo "Running database migrations..."
if ! npx prisma migrate deploy 2>&1; then
    echo "ERROR: Database migration failed"
    exit 1
fi

echo "Starting Next.js application..."
exec "$@"
