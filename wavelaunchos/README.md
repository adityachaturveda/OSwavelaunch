## WaveLaunchOS

WaveLaunchOS is a role-based operating system for agencies to manage client engagements, deliverables, and business intelligence from a single dashboard. Administrators can onboard clients, monitor KPIs, track deliverables, and review notes/files. Client users (portal) can log in to access their latest plans, deliverables, and shared resources.

### Tech Stack
- Next.js App Router (TypeScript, React 19)
- NextAuth (credential auth with Prisma adapter)
- Prisma ORM with SQLite (local development)
- Tailwind CSS + shadcn/ui component primitives
- Radix UI, TanStack Table, Recharts

## Prerequisites
- Node.js 20+
- pnpm (preferred) or npm/yarn

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy the example environment file:
   ```bash
   cp env.example .env
   # or manually create .env with the contents from env.example
   ```
   Populate secrets as needed (`NEXTAUTH_SECRET` can be any random string for local dev).
3. Apply database migrations and seed sample data:
   ```bash
   pnpm prisma:migrate deploy
   pnpm prisma:seed
   ```
   The seed script ensures an admin user, a client portal user, sample clients, deliverables, dashboard metrics, and visitor analytics.

## Running the App
```bash
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) after the server starts.

### Seeded Accounts
| Role    | Email                     | Password     |
|---------|---------------------------|--------------|
| Admin   | `admin@wavelaunchos.com`  | `ChangeMe123!` |
| Client  | `client@wavelaunchos.com` | `ChangeMe123!` |

> Update these credentials in `.env` before deploying.

## Smoke Testing
- `pnpm dev` to launch the app
- Sign in as the admin user and navigate to `/dashboard`
- Create or edit a client and verify notes, activities, deliverables, plans, and file uploads
- Log out, sign in as the client user, and confirm the `/portal` landing page loads
- Submit the `/apply` form and confirm the success screen appears

## Useful Commands
- `pnpm prisma:studio` – inspect the database
- `pnpm prisma:generate` – regenerate Prisma client
- `pnpm lint` – run ESLint
- `pnpm build` – production build

## Project Structure Highlights
- `app/` – App Router pages (dashboard, clients, portal, APIs)
- `components/` – shared UI + feature components
- `lib/` – services, data loaders, utilities, auth helpers
- `prisma/` – schema, migrations, seed script

## Contributing
1. Create a feature branch
2. Follow the coding standards (TypeScript + ESLint + Prettier)
3. Ensure tests and lint pass
4. Submit a PR with a concise summary of changes
