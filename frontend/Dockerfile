FROM node:24 AS base

WORKDIR /usr/src/app

# Development stage

FROM base AS development

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# Build stage

FROM base AS build

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

# Runtime stage

FROM base AS production

COPY --from=build /usr/src/app/package*.json ./

COPY --from=build /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 5173

CMD ["npm", "run", "start"]
