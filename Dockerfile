# Production Multi-Stage Dockerfile for CourseraX Full-Stack App
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install all dependencies for build
RUN npm install

# Copy application source code
COPY . .

# Build Vite client production assets into /app/dist
RUN npm run build

# -------------------------------------------------------------
# Production Runner Stage
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifest
COPY package.json ./

# Install runtime dependencies
RUN npm install --omit=dev && npm install -g tsx

# Copy built frontend assets and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/src/types ./src/types
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder /app/metadata.json ./metadata.json

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
