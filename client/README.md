# CareerBridge client

The client is a Next.js App Router application using React 19, TypeScript,
Tailwind CSS, Firebase Authentication, React Hook Form, Zod, Axios, and TanStack
Query.

## Commands

Run these from the repository root:

```powershell
pnpm dev:client
pnpm typecheck:client
pnpm lint
pnpm test:client
pnpm build:client
```

Copy `.env.example` to `.env.local` before local development. Every
`NEXT_PUBLIC_*` value is browser-visible and must not contain Firebase Admin,
database, Cloudinary, or deployment credentials.

## Data flow

Production API state follows:

```text
app page -> feature component/hook -> service -> centralized Axios client -> API
```

TanStack Query owns remote state. Mutations invalidate related list, detail,
profile, and dashboard keys. Pages must not silently substitute mock operational
data when an API fails. Static marketing content and test fixtures remain
separate from API services.

Firebase establishes identity. `AuthProvider` synchronizes the verified ID token
through `/api/v1/users/sync`; MongoDB roles and account status remain the backend
authorization source.
