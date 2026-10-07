FROM ghcr.io/voidzero-dev/vite-plus:latest AS build

USER root
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.cache/pnpm \
    vp install --frozen-lockfile

COPY . .
RUN NODE_ENV=production vp build

FROM gcr.io/distroless/nodejs26-debian13:latest

WORKDIR /app
COPY --from=build /app/dist .
COPY --from=build /app/drizzle drizzle

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
EXPOSE 3000
CMD ["--enable-source-maps", "server/index.mjs"]
