# ---------- Base ----------
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# ---------- Dependências ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Builder ----------
FROM base AS builder
# Variáveis NEXT_PUBLIC_* são embutidas no bundle do cliente em tempo de build.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_UAZAPI_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_UAZAPI_URL=$NEXT_PUBLIC_UAZAPI_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec next build

# ---------- Runner (produção) ----------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# node_modules completo (inclui drizzle-kit para rodar as migrações no start)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src ./src

EXPOSE 3000
# Aplica migrações pendentes e sobe o servidor.
CMD ["sh", "-c", "pnpm run db:migrate && pnpm start"]
