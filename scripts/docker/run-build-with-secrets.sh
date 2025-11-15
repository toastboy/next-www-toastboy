#!/usr/bin/env bash
set -euo pipefail

SECRET_DIR=${SECRET_DIR:-/run/secrets}
REQUIRED_VARS=(
  DATABASE_URL
  MYSQL_ROOT_PASSWORD
  AZURE_TENANT_ID
  AZURE_SUBSCRIPTION_ID
  AZURE_CLIENT_ID
  AZURE_CLIENT_SECRET
  AZURE_STORAGE_ACCOUNT_NAME
  AZURE_CONTAINER_NAME
  BETTER_AUTH_SECRET
  BETTER_AUTH_URL
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  MICROSOFT_CLIENT_ID
  MICROSOFT_CLIENT_SECRET
  SENTRY_AUTH_TOKEN
)

unresolved=()
missing=()

for name in "${REQUIRED_VARS[@]}"; do
  secret_path="${SECRET_DIR}/${name}"
  if [[ -f "${secret_path}" ]]; then
    value=$(tr -d '\r' < "${secret_path}")
    export "${name}=${value}"
    if [[ "${value}" == op://* ]]; then
      unresolved+=("${name}")
    fi
  fi

  if [[ -z "${!name:-}" ]]; then
    missing+=("${name}")
  fi
done

if (( ${#missing[@]} > 0 )); then
  printf 'Missing required environment for:\n' >&2
  for name in "${missing[@]}"; do
    printf '  - %s\n' "$name" >&2
  done
  printf '\nProvide them via BuildKit secrets (e.g. --secret id=NAME,env=NAME) or wrap the build with 1Password, for example:\n' >&2
  printf '  op run --env-file ./.env -- docker build .\n' >&2
  exit 1
fi

if (( ${#unresolved[@]} > 0 )); then
  printf 'Warning: unresolved 1Password references for:\n' >&2
  for name in "${unresolved[@]}"; do
    printf '  - %s\n' "$name" >&2
  done
fi

if [[ $# -gt 0 ]]; then
  exec "$@"
else
  exec npm run build
fi
