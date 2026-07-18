# CareerBridge

CareerBridge is a pnpm monorepo for a job marketplace with a Next.js 16/React
19 client, an Express 5 API, Firebase Authentication, MongoDB/Mongoose, and
Cloudinary-backed private resume storage.

## Repository layout

```text
client/   Next.js App Router UI
server/   Express API, feature services, validation, and Mongoose models
scripts/  repository-local security checks
```

Client features follow `Page -> Hooks -> Services -> API`. TanStack Query owns
server state and centralized query keys; Axios attaches Firebase ID tokens.
Server routes apply Firebase verification, role authorization, and account-status
checks before thin controllers call feature services.

## Requirements and installation

- Node.js 22
- pnpm 11.5.2 (pinned in `package.json` and CI)
- MongoDB replica set for transactions used by resume operations
- A non-production Firebase project
- A non-production Cloudinary account when testing uploads

```powershell
pnpm install --frozen-lockfile
Copy-Item client/.env.example client/.env.local
Copy-Item server/.env.example server/.env
```

Replace placeholders only in ignored local files. Never put server credentials
in `NEXT_PUBLIC_*` variables.

## Environment

The client requires `NEXT_PUBLIC_API_URL` and the six documented Firebase web
application variables in `client/.env.example`.

The server requires MongoDB, Firebase Admin, client origin, and request-policy
configuration from `server/.env.example`. Cloudinary variables are required for
resume and image uploads. `JWT_SECRET` is legacy configuration; Firebase ID
tokens are the active authentication mechanism.

`TRUST_PROXY_HOPS` must match the known production proxy topology. Do not enable
unrestricted proxy trust. Production secrets belong in the hosting platform's
secret manager, never an image, repository, or client bundle.

## Development and verification

```powershell
pnpm dev:server
pnpm dev:client

pnpm security:secrets
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Exact local/CI sequence
pnpm verify
```

Tests use Node's built-in runner and the existing `tsx` TypeScript boundary.
Backend HTTP tests mock Firebase verification, storage, and persistence
boundaries and never load production credentials. Client contract tests cover
Zod form input/output behavior and API normalization without a browser.

The current suite does not start MongoDB. Any database integration suite added
later must use a URI whose database name is explicitly `careerbridge_test` (or a
disposable equivalent), must fail closed for Atlas/production hosts, and must
clean only records it created. Firebase end-to-end tests must use the Firebase
Auth Emulator or a dedicated disposable project. Cloudinary tests must mock the
provider unless a dedicated test account and cleanup procedure are configured.

## Authentication and authorization

Email/password and Google establish Firebase identity. The client synchronizes
the ID token through `POST /api/v1/users/sync`. MongoDB is authoritative for
CareerBridge role and account status. Public registration permits only
`job_seeker` and `employer`; employers begin pending. Admin and super-admin roles
cannot be self-assigned. Protected APIs enforce ownership in their database
queries in addition to role and status middleware.

## Deployment prerequisites

Build both applications with `pnpm build`. Deploy the client and API separately,
configure the client API URL, allowed CORS origin, Firebase authorized domains,
Firebase Admin credentials, MongoDB URI, Cloudinary credentials, exact proxy-hop
count, and ingress/shared rate limiting for multi-instance deployments.

CI intentionally performs verification only. It does not deploy. Add deployment
automation only after a target, environment protections, rollback process, and
authorization are documented.

## Credential incident response

If a secret is committed or logged:

1. Revoke or rotate it immediately in MongoDB Atlas, Firebase/Google Cloud,
   Cloudinary, and every deployment platform where it was installed.
2. Replace deployment secrets and validate affected services without printing
   values.
3. Review provider audit logs and invalidate active sessions when appropriate.
4. Run `pnpm security:secrets` and add a regression pattern if needed.
5. Coordinate Git-history remediation separately. Removing a value from the
   current branch does not erase historical exposure; do not rewrite shared
   history without an agreed migration plan.

## Current testing gaps

The lightweight suite does not yet provide rendered React hook/form tests,
browser end-to-end tests, automated accessibility scans, Firebase Emulator
coverage, or isolated MongoDB CRUD integration. These require an intentional
test dependency and infrastructure decision; they must not use production Atlas
or Firebase credentials.
