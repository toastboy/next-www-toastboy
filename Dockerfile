# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20.19.5

FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    npm_config_update_notifier=false \
    npm_config_fund=false

FROM base AS deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential ca-certificates openssl && \
    rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS builder
COPY . .
RUN --mount=type=secret,id=DATABASE_URL,required=false \
    --mount=type=secret,id=MYSQL_ROOT_PASSWORD,required=false \
    --mount=type=secret,id=AZURE_TENANT_ID,required=false \
    --mount=type=secret,id=AZURE_SUBSCRIPTION_ID,required=false \
    --mount=type=secret,id=AZURE_CLIENT_ID,required=false \
    --mount=type=secret,id=AZURE_CLIENT_SECRET,required=false \
    --mount=type=secret,id=AZURE_STORAGE_ACCOUNT_NAME,required=false \
    --mount=type=secret,id=AZURE_CONTAINER_NAME,required=false \
    --mount=type=secret,id=API_URL,required=false \
    --mount=type=secret,id=BETTER_AUTH_SECRET,required=false \
    --mount=type=secret,id=BETTER_AUTH_URL,required=false \
    --mount=type=secret,id=BETTER_AUTH_ADMIN_TOKEN,required=false \
    --mount=type=secret,id=GOOGLE_CLIENT_ID,required=false \
    --mount=type=secret,id=GOOGLE_CLIENT_SECRET,required=false \
    --mount=type=secret,id=MICROSOFT_CLIENT_ID,required=false \
    --mount=type=secret,id=MICROSOFT_CLIENT_SECRET,required=false \
    --mount=type=secret,id=SENTRY_AUTH_TOKEN,required=false \
    --mount=type=secret,id=TF_VAR_azure_tenant_id,required=false \
    --mount=type=secret,id=TF_VAR_azure_subscription_id,required=false \
    --mount=type=secret,id=TF_VAR_azure_client_id,required=false \
    --mount=type=secret,id=TF_VAR_azure_client_secret,required=false \
    --mount=type=cache,target=/root/.npm \
    bash ./scripts/docker/run-build-with-secrets.sh



FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM --platform=$TARGETPLATFORM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/sentry.edge.config.ts ./sentry.edge.config.ts
COPY --from=builder /app/sentry.server.config.ts ./sentry.server.config.ts

RUN groupadd --system nextjs && useradd --system --gid nextjs nextjs \
    && chown -R nextjs:nextjs /app

USER nextjs
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]
