## bank monorepo (Bun)

This is a **basic Bun monorepo** using workspaces, with:

- `apps/api` – small HTTP API powered by `Bun.serve`
- `apps/web` – simple console-based “web” app example
- `packages/utils` – shared utilities used by both apps

### Install dependencies

From the repo root:

```bash
bun install
```

### Run the API app

```bash
bun run dev:api
```

This starts a Bun HTTP server on `http://localhost:3001`.

### Run the web app

```bash
bun run dev:web
```

This just logs a greeting to the console using the shared `@bank/utils` package.

### Monorepo layout

- `package.json` – root workspace config (Bun monorepo)
- `apps/api` – API workspace (`@bank/api`)
- `apps/web` – web workspace (`@bank/web`)
- `packages/utils` – shared utilities (`@bank/utils`)

You can add more apps/packages under `apps/*` and `packages/*` and they will automatically be included in the workspace.
