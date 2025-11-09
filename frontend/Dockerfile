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
ARG NEXT_PUBLIC_MOCK_BASE_URL
ARG MOCK_BASE_URL_INTERNAL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_MOCK_BASE_URL=${NEXT_PUBLIC_MOCK_BASE_URL}
ENV MOCK_BASE_URL_INTERNAL=${MOCK_BASE_URL_INTERNAL}

RUN npm run build

FROM node:${NODE_VERSION} AS runner

RUN addgroup -g 1001 next && adduser -D -u 1001 -G next nextjs

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --chown=nextjs:next package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=nextjs:next --from=builder /app/public ./public
COPY --chown=nextjs:next --from=builder /app/.next ./.next

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]