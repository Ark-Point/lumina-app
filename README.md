# Lumina-app

Turborepo-based Node.js monorepo template. Shared configuration and libraries live under `packages/*`, while NestJS/Next.js/Hardhat applications are developed in `apps/*`.

## Directory Structure

- `apps/api` – NestJS HTTP API server
- `apps/web` – Next.js 15 + React 19 front-end
- `apps/worker` – NestJS background worker powered by BullMQ
- `apps/llm-agent` – NestJS chat agent proxying OpenAI-compatible APIs with optional conversation memory
- `apps/scheduler` – NestJS scheduler using cron-style jobs
- `packages/config` – Loads `env.<NODE_ENV>` files at runtime
- `packages/database` – NestJS `DatabaseModule` plus shared TypeORM entities/repositories
- `packages/redis` – Redis module with BullMQ-safe defaults
- `packages/evm-contracts` – Hardhat-based EVM smart contract package

## Tech Stack

### Apps

- **API (`apps/api`)**: NestJS 11, TypeORM, Swagger, JWT auth, cache manager
- **Web (`apps/web`)**: Next.js 15, React 19, RainbowKit + wagmi, Emotion
- **Worker (`apps/worker`)**: NestJS 11, BullMQ, Redis, Postgres
- **LLM Agent (`apps/llm-agent`)**: NestJS 11 service that streams chat completions from OpenAI-compatible providers with optional Postgres memory
- **Scheduler (`apps/scheduler`)**: NestJS 11, BullMQ, cron scheduling, Axios

### Packages

- **Config (`packages/config`)**: Automatically loads environment variables per `NODE_ENV` via `dotenv`
- **Database (`packages/database`)**: NestJS `DynamicModule` that bootstraps TypeORM and exports shared entities/repositories
- **Redis (`packages/redis`)**: Global Redis client module built on `ioredis`
- **EVM Contracts (`packages/evm-contracts`)**: Hardhat, TypeChain, OpenZeppelin for smart contract development

## Local Setup

1. Align Node.js version with `.nvmrc` (v24.8.0):
   ```bash
   nvm use
   ```
2. Install workspace dependencies:
   ```bash
   npm install
   ```
3. (Optional) Launch local Postgres/Redis using `docker-compose.yml`:
   ```bash
   docker compose up -d
   ```
4. (Optional) Run the web + LLM agent stack with Docker:
   ```bash
   docker compose -f docker-compose-apps.yml up --build
   ```

## Environment Variables

1. Copy the sample file to create `env.local` at the repo root:
   ```bash
   cp env.example env.local
   ```
2. Update values for ports, origins, DB/Redis credentials, and any LLM provider keys (`OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`) as needed.
3. `packages/config` resolves `env.<NODE_ENV>` automatically. Development defaults to `NODE_ENV=local`; add files like `env.development` or `env.production` for other environments.

## Local Development

- Run all apps in parallel (watch mode):
  ```bash
  npm run dev
  ```
- Run a single app:
  ```bash
  npx turbo run dev --filter=@lumina-app/web
  npx turbo run start --filter=@lumina-app/api
  npx turbo run dev --filter=@lumina-app/llm-agent
  ```
- NestJS services log which `env.*` file is loaded according to `NODE_ENV`.

## Build & Production

```bash
npm run build   # Build all apps/packages
npm run start   # Run with built artifacts
```

To build a specific package:

```bash
npx turbo run build --filter=@lumina-app/worker
```

## Testing & Quality

- Global lint:
  ```bash
  npm run lint
  ```
- API unit tests:
  ```bash
  npx turbo run test --filter=@lumina-app/api
  ```
- Smart contract tests:
  ```bash
  cd packages/evm-contracts
  npm test
  ```

## Notes

- `docker-compose.yml` spins up Postgres 16 and Redis 7 for local development.
- `packages/database` and `packages/redis` read connection details from `env.*` and expose ready-to-use NestJS modules.
- The LLM agent reuses the shared database module; provide a `conversationId` to persist chat history in Postgres.
- Expose the agent to the mini app by setting `NEXT_PUBLIC_LLM_AGENT_URL` (e.g., `http://localhost:3100`).
- `turbo.json` defines build/run/lint pipelines and leverages caching to speed up development.

Feel free to customize the environment and execution flows to match your deployment strategy.
