# Cloudflare Admin Payload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the Payload admin/API as a Cloudflare fullstack Worker using Postgres for CMS database storage and R2 for uploaded media.

**Architecture:** Keep the existing static frontend Worker separate. Convert the fullstack admin Worker from local SQLite/media to external Postgres and Cloudflare R2, then deploy the OpenNext Worker only after clean build, dry-run, and live route checks pass.

**Tech Stack:** Next.js 15, Payload 3.85, OpenNext Cloudflare 1.18, Wrangler 4, Postgres, Cloudflare R2.

---

### Task 1: Add Payload Cloudflare/Postgres Adapters

**Files:**
- Modify: `/Users/gobe/gobe_website/package.json`
- Modify: `/Users/gobe/gobe_website/package-lock.json`

- [ ] **Step 1: Install Postgres and R2 adapters**

Run:

```bash
rtk npm install @payloadcms/db-postgres@3.85.0 @payloadcms/storage-r2@3.85.0 --legacy-peer-deps
```

Expected: `package.json` gains `@payloadcms/db-postgres` and `@payloadcms/storage-r2`, and npm exits with code 0.

- [ ] **Step 2: Verify dependency versions**

Run:

```bash
rtk npm ls @payloadcms/db-postgres @payloadcms/storage-r2 payload
```

Expected: all three packages resolve at `3.85.0`.

### Task 2: Create Cloudflare Media Resource And Database Secret

**Files:**
- Modify: `/Users/gobe/gobe_website/wrangler.jsonc`

- [ ] **Step 1: Provision external Postgres database**

Run:

```bash
Create a Neon, Supabase, Railway, Render, or self-hosted Postgres database and collect a connection string like:

```bash
postgresql://user:password@host:5432/database?sslmode=require
```

Expected: the connection string is reachable from a serverless runtime and includes SSL when required by the provider.

- [ ] **Step 2: Create R2 bucket**

Run:

```bash
rtk proxy npx wrangler r2 bucket create gobe-payload-media
```

Expected: Wrangler confirms the bucket was created or already exists.

- [ ] **Step 3: Add R2 binding and public URL to `wrangler.jsonc`**

Add the R2 bucket:

```jsonc
"r2_buckets": [
  {
    "binding": "PAYLOAD_MEDIA",
    "bucket_name": "gobe-payload-media"
  }
],
"vars": {
  "NEXT_PUBLIC_SERVER_URL": "https://gobe-immersive-3d.joe-378.workers.dev"
}
```

Expected: `wrangler deploy --dry-run --config wrangler.jsonc` can see `PAYLOAD_MEDIA` binding.

### Task 3: Wire Payload to Postgres and R2

**Files:**
- Modify: `/Users/gobe/gobe_website/payload.config.ts`
- Modify: `/Users/gobe/gobe_website/collections/Media.ts`

- [ ] **Step 1: Replace Cloudflare runtime database with Postgres adapter**

Change `payload.config.ts` to import `postgresAdapter` and `getCloudflareContext`. Keep the local SQLite adapter as a build/local fallback only:

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
```

Add:

```ts
const getCloudflareEnv = () => {
  try {
    return getCloudflareContext().env;
  } catch {
    return undefined;
  }
};

const getDatabaseAdapter = () => {
  const env = getCloudflareEnv();

  const databaseUri = process.env.DATABASE_URI || env?.DATABASE_URI;

  if (databaseUri?.startsWith("postgres")) {
    return postgresAdapter({
      pool: {
        connectionString: databaseUri,
      },
    });
  }

  return sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.db",
    },
  });
};
```

Use:

```ts
db: getDatabaseAdapter(),
```

Expected: local `next build` still works, while Worker runtime uses `DATABASE_URI`.

- [ ] **Step 2: Add R2 storage plugin for media uploads**

Import:

```ts
import { r2Storage } from "@payloadcms/storage-r2";
```

Add:

```ts
const getStoragePlugins = () => {
  const env = getCloudflareEnv();

  if (!env?.PAYLOAD_MEDIA) {
    return [];
  }

  return [
    r2Storage({
      bucket: env.PAYLOAD_MEDIA,
      collections: {
        media: true,
      },
    }),
  ];
};
```

Use:

```ts
plugins: [
  seoPlugin({
    collections: ["news"],
    uploadsCollection: "media",
    tabbedUI: true,
    generateTitle,
    generateDescription,
  }),
  ...getStoragePlugins(),
],
```

Expected: local media continues using `public/media`; Worker media writes to R2.

### Task 4: Configure Production Secrets

**Files:**
- No source file changes.

- [ ] **Step 1: Set Payload secret**

Run:

```bash
rtk node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy the generated value into:

```bash
rtk proxy npx wrangler secret put PAYLOAD_SECRET --config wrangler.jsonc
```

Expected: Wrangler stores the secret without printing the value.

- [ ] **Step 2: Verify auth state does not use fallback**

Run:

```bash
rtk proxy npx wrangler secret list --config wrangler.jsonc
```

Expected: `PAYLOAD_SECRET` is listed.

- [ ] **Step 3: Set Postgres connection string**

Run:

```bash
rtk proxy npx wrangler secret put DATABASE_URI --config wrangler.jsonc
```

Expected: Wrangler stores the secret without printing the value.

### Task 5: Generate Types and Build

**Files:**
- Modify if generated: `/Users/gobe/gobe_website/cloudflare-env.d.ts`
- Modify if generated: `/Users/gobe/gobe_website/payload-types.ts`

- [ ] **Step 1: Generate Wrangler types**

Run:

```bash
rtk proxy npm run cf-typegen
```

Expected: `cloudflare-env.d.ts` includes `PAYLOAD_MEDIA: R2Bucket`. `DATABASE_URI` is a secret and may not appear in generated types.

- [ ] **Step 2: Generate Payload types**

Run:

```bash
rtk npm run generate:types
```

Expected: Payload exits with code 0.

- [ ] **Step 3: Build Next locally**

Run:

```bash
rtk npm run build
```

Expected: Next exits with code 0.

- [ ] **Step 4: Build OpenNext Cloudflare**

Run:

```bash
rtk proxy npx opennextjs-cloudflare build
```

Expected: OpenNext exits with code 0. If the existing `esbuild panic: Unexpected expression of type <nil>` returns, stop and debug the generated server chunk before deployment.

### Task 6: Deploy and Verify Admin

**Files:**
- No source file changes unless verification exposes runtime bugs.

- [ ] **Step 1: Dry-run Worker deploy**

Run:

```bash
rtk proxy npx wrangler deploy --dry-run --config wrangler.jsonc
```

Expected: dry-run exits with code 0 and lists `PAYLOAD_MEDIA`, `ASSETS`, `IMAGES`, and `WORKER_SELF_REFERENCE`.

- [ ] **Step 2: Deploy fullstack Worker**

Run:

```bash
rtk proxy npx wrangler deploy --config wrangler.jsonc
```

Expected: Wrangler prints the deployed Worker URL.

- [ ] **Step 3: Verify live routes**

Run:

```bash
rtk curl -I https://gobe-immersive-3d.joe-378.workers.dev/admin
rtk curl -I https://gobe-immersive-3d.joe-378.workers.dev/api/users
rtk curl -I https://gobe-immersive-3d.joe-378.workers.dev/graphql
```

Expected: `/admin` responds with a 200 or redirect to login; `/api/users` responds with a Payload API response status; `/graphql` responds without Worker runtime crashes.

---

## Self-Review

- Spec coverage: Covers user choice 2 by moving admin to Cloudflare, including D1, R2, secrets, build, deploy, and verification.
- Placeholder scan: Only `<database_id-from-wrangler>` is intentionally runtime-provided by Wrangler after resource creation.
- Type consistency: Runtime secret is consistently `DATABASE_URI`; R2 binding is consistently `PAYLOAD_MEDIA`.
