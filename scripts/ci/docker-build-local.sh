#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: docker-build-local.sh <docker-build-args...>" >&2
  echo "Example: docker-build-local.sh -t next-www-toastboy ." >&2
  exit 1
fi

SECRET_NAMES=(
  DATABASE_URL
  MYSQL_ROOT_PASSWORD
  AZURE_TENANT_ID
  AZURE_SUBSCRIPTION_ID
  AZURE_CLIENT_ID
  AZURE_CLIENT_SECRET
  AZURE_STORAGE_ACCOUNT_NAME
  AZURE_CONTAINER_NAME
  API_URL
  BETTER_AUTH_SECRET
  BETTER_AUTH_URL
  BETTER_AUTH_ADMIN_TOKEN
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  MICROSOFT_CLIENT_ID
  MICROSOFT_CLIENT_SECRET
  SENTRY_AUTH_TOKEN
  TF_VAR_azure_tenant_id
  TF_VAR_azure_subscription_id
  TF_VAR_azure_client_id
  TF_VAR_azure_client_secret
)

missing=()
for name in "${SECRET_NAMES[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    missing+=("$name")
  fi
done

if (( ${#missing[@]} > 0 )); then
  printf 'Missing required environment variables for build:\n' >&2
  for name in "${missing[@]}"; do
    printf '  - %s\n' "$name" >&2
  done
  printf '\nWrap this script with 1Password to populate them, for example:\n'
  printf '  op run --env-file ./.env -- %s %s\n' "$0" "$*" >&2
  exit 1
fi

build_args=("docker" "build")
for name in "${SECRET_NAMES[@]}"; do
  build_args+=("--secret" "id=${name},env=${name}")
done

build_args+=("$@")

exec "${build_args[@]}"
