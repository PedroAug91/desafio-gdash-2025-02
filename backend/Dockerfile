FROM node:24 AS base

WORKDIR /usr/src/api

USER node

# Development stage

FROM base AS development

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

CMD ["npm", "run", "start:dev"]

# Build stage

FROM base AS build

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

USER node

RUN npm run build

# Runtime stage

FROM base AS production

COPY --from=build /usr/src/api/package*.json ./

COPY --from=build /usr/src/api/node_modules ./node_modules

COPY --from=build /usr/src/api/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
