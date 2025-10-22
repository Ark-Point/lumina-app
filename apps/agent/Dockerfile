FROM node:24-alpine AS base
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json turbo.json tsconfig.json ./ 
COPY packages ./packages
COPY apps ./apps

RUN npm ci

RUN npm run build --workspace=@lumina-app/llm-agent

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=local

COPY --from=base /app/package.json /app/package-lock.json ./ 
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps ./apps
COPY --from=base /app/packages ./packages

RUN npm prune --omit=dev

EXPOSE 3100

CMD ["npm", "run", "start", "--workspace=@lumina-app/llm-agent"]
