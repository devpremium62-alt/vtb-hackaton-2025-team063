# syntax=docker/dockerfile:1

ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS deps

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm ci

FROM node:${NODE_VERSION} AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN npm run build

FROM node:${NODE_VERSION} AS runner

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

RUN addgroup -g 1001 next && adduser -D -u 1001 -G next nextjs \
    && chown -R nextjs:next /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]