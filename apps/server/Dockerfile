FROM node:20-alpine AS build
WORKDIR /app

# Copy workspace root files needed for npm install
COPY package.json package-lock.json turbo.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/shared-auth/package.json ./packages/shared-auth/
COPY packages/shared-components/package.json ./packages/shared-components/
COPY packages/shared-hooks/package.json ./packages/shared-hooks/

# Install dependencies
RUN npm ci --ignore-scripts
RUN cd apps/server && npm rebuild bcrypt

# Copy source files
COPY apps/server/ ./apps/server/
COPY packages/ ./packages/

# Generate Prisma Client (dummy DATABASE_URL needed for prisma.config.ts)
RUN cd apps/server && DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build NestJS
RUN cd apps/server && npm run build

# --- Production ---
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/generated ./apps/server/generated
COPY --from=build /app/apps/server/prisma ./apps/server/prisma
COPY --from=build /app/apps/server/prisma.config.ts ./apps/server/prisma.config.ts
COPY --from=build /app/apps/server/package.json ./apps/server/package.json

WORKDIR /app/apps/server

EXPOSE 4000
CMD ["node", "dist/main"]
