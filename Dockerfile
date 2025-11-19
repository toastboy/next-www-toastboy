# syntax=docker/dockerfile:1.7

FROM --platform=$BUILDPLATFORM node:20.19.5-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1 \
    npm_config_update_notifier=false \
    npm_config_fund=false

FROM base AS deps
RUN apt-get update && \
    # apt-get install -y --no-install-recommends build-essential ca-certificates openssl && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS builder
COPY . .
ARG DATABASE_URL
ARG AZURE_TENANT_ID
ARG AZURE_CLIENT_ID
ARG AZURE_CLIENT_SECRET
ARG AZURE_STORAGE_ACCOUNT_NAME
ARG AZURE_CONTAINER_NAME
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG MICROSOFT_CLIENT_ID
ARG MICROSOFT_CLIENT_SECRET
ARG SENTRY_AUTH_TOKEN
ARG MAIL_FROM_ADDRESS
ARG MAIL_FROM_NAME
ARG MAIL_SMTP_HOST
ENV DATABASE_URL=${DATABASE_URL}
ENV AZURE_TENANT_ID=${AZURE_TENANT_ID}
ENV AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
ENV AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
ENV AZURE_STORAGE_ACCOUNT_NAME=${AZURE_STORAGE_ACCOUNT_NAME}
ENV AZURE_CONTAINER_NAME=${AZURE_CONTAINER_NAME}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV MICROSOFT_CLIENT_ID=${MICROSOFT_CLIENT_ID}
ENV MICROSOFT_CLIENT_SECRET=${MICROSOFT_CLIENT_SECRET}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}
ENV MAIL_FROM_NAME=${MAIL_FROM_NAME}
ENV MAIL_SMTP_HOST=${MAIL_SMTP_HOST}
RUN npm run build

FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM --platform=$TARGETPLATFORM node:20.19.5-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

COPY --from=prod-deps /node_modules ./node_modules
COPY --from=builder /package.json ./package.json
COPY --from=builder /package-lock.json ./package-lock.json
COPY --from=builder /next.config.mjs ./next.config.mjs
COPY --from=builder /secrets-logic.mjs ./secrets-logic.mjs
COPY --from=builder /public ./public
COPY --from=builder /.next ./.next
COPY --from=builder /prisma ./prisma
COPY --from=builder /sentry.edge.config.ts ./sentry.edge.config.ts
COPY --from=builder /sentry.server.config.ts ./sentry.server.config.ts

RUN groupadd --system nextjs && useradd --system --gid nextjs nextjs \
    && chown -R nextjs:nextjs /app

USER nextjs
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]
