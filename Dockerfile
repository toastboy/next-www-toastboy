# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.19.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN --mount=type=secret,id=AZURE_TENANT_ID \
    --mount=type=secret,id=AZURE_CLIENT_ID \
    --mount=type=secret,id=AZURE_CLIENT_SECRET \
    --mount=type=secret,id=AZURE_STORAGE_ACCOUNT_NAME \
    --mount=type=secret,id=AZURE_STORAGE_CONTAINER_NAME \
    --mount=type=secret,id=DATABASE_URL \
    --mount=type=secret,id=BETTER_AUTH_SECRET \
    --mount=type=secret,id=GOOGLE_CLIENT_ID \
    --mount=type=secret,id=GOOGLE_CLIENT_SECRET \
    --mount=type=secret,id=MICROSOFT_CLIENT_ID \
    --mount=type=secret,id=MICROSOFT_CLIENT_SECRET \
    sh -c 'export AZURE_TENANT_ID=$(cat /run/secrets/AZURE_TENANT_ID) && \
    export AZURE_CLIENT_ID=$(cat /run/secrets/AZURE_CLIENT_ID) && \
    export AZURE_CLIENT_SECRET=$(cat /run/secrets/AZURE_CLIENT_SECRET) && \
    export AZURE_STORAGE_ACCOUNT_NAME=$(cat /run/secrets/AZURE_STORAGE_ACCOUNT_NAME) && \
    export AZURE_STORAGE_CONTAINER_NAME=$(cat /run/secrets/AZURE_STORAGE_CONTAINER_NAME) && \
    export DATABASE_URL=$(cat /run/secrets/DATABASE_URL) && \
    export BETTER_AUTH_SECRET=$(cat /run/secrets/BETTER_AUTH_SECRET) && \
    export GOOGLE_CLIENT_ID=$(cat /run/secrets/GOOGLE_CLIENT_ID) && \
    export GOOGLE_CLIENT_SECRET=$(cat /run/secrets/GOOGLE_CLIENT_SECRET) && \
    export MICROSOFT_CLIENT_ID=$(cat /run/secrets/MICROSOFT_CLIENT_ID) && \
    export MICROSOFT_CLIENT_SECRET=$(cat /run/secrets/MICROSOFT_CLIENT_SECRET) && \
    npm run build'

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next


# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]
