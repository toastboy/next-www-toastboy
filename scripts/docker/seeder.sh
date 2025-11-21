#!/bin/sh
set -e

echo "===== Database Seeder ====="
echo "Running generate..."
if ! npx prisma generate 2>&1; then
    echo "ERROR: Prisma generate failed"
    exit 1
fi

echo "Running migrations..."
if ! npx prisma migrate deploy 2>&1; then
    echo "ERROR: Database migration failed"
    exit 1
fi

echo "Seeding database..."
if ! npx prisma db seed 2>&1; then
    echo "ERROR: Database seed failed"
    exit 1
fi

echo "===== Seeder complete ====="
