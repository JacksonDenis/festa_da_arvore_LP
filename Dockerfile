FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run verify

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/server.mjs ./
COPY --from=build /app/src ./src
COPY --from=build /app/scripts/notifications.mjs ./scripts/notifications.mjs
COPY --from=build /app/public ./public

RUN mkdir -p /data && chown -R node:node /app /data

USER node
EXPOSE 4173
VOLUME ["/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:4173/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
