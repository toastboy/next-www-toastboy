#!/bin/bash
set -e

# Runs once, via docker-entrypoint-initdb.d, on first boot of an empty
# MariaDB data directory. Creates the non-privileged user the app and seed
# scripts connect as at runtime (SYS-444) - root stays reserved for schema
# changes (prisma migrate/db push) and for this script itself.
if [ -z "$DATABASE_APP_PASSWORD" ]; then
    echo "DATABASE_APP_PASSWORD not set - skipping footy_app creation" >&2
    exit 0
fi

# SQL-escape the password before embedding it in the CREATE USER statement
# below - same algorithm the base mariadb image's own entrypoint uses for
# MARIADB_PASSWORD/MARIADB_ROOT_PASSWORD (docker_sql_escape_string_literal in
# docker-entrypoint.sh). That function isn't in scope here to call directly:
# each *.sh script under docker-entrypoint-initdb.d runs as its own process,
# not sourced into the entrypoint's shell.
escaped_password=${DATABASE_APP_PASSWORD//\\/\\\\}
escaped_password="${escaped_password//$'\n'/\\n}"
escaped_password="${escaped_password//\'/\\\'}"

mariadb -u root -p"$MARIADB_ROOT_PASSWORD" <<-EOSQL
    CREATE USER IF NOT EXISTS 'footy_app'@'%' IDENTIFIED BY '${escaped_password}';
    GRANT SELECT, INSERT, UPDATE, DELETE ON footy.* TO 'footy_app'@'%';
    FLUSH PRIVILEGES;
EOSQL
