# Project Plan: Azure POC Website (Supabase + Next.js + Azure Web App)

## Goal
Build a simple proof-of-concept website with a backend and database, primarily to learn
the Azure deployment workflow for the first time. Not production-critical — optimized for
learning and fast iteration with Claude Code.

## Stack Decisions

- **Frontend + Backend**: Next.js (App Router). One framework handles both the UI and API
  routes, which keeps a POC simple — no separate frontend/backend repos or deploy pipelines.
- **Database**: Supabase (hosted Postgres). Chosen over native Azure databases (Azure SQL,
  Cosmos DB, Azure Database for PostgreSQL) because:
  - It's plain Postgres with a clean JS/TS SDK and strong CLI/migration tooling.
  - Built-in auth, row-level security, storage, and realtime — no need to bolt on Azure AD B2C
    for a POC.
  - Well-documented and widely used with JS/Node, so Claude Code generates more reliable code
    against it than against less common Azure-native DB setups.
  - **Future option**: if this project grows or needs to live fully inside Azure, migrating to
    **Azure Database for PostgreSQL (Flexible Server)** later is straightforward since both are
    Postgres — same SQL, same mental model, no rewrite.
- **Hosting**: Azure App Service (Web App), Free (F1) tier for the POC. This is the actual
  "Azure workflow" being learned — deployments, environment/app settings, GitHub Actions CI/CD,
  monitoring.
- **Source control**: Personal GitHub account. Azure Web App's Deployment Center connects
  directly to a GitHub repo and auto-generates a GitHub Actions workflow for CI/CD.

## Why NOT other Azure resources for this project
- **Static Web Apps**: great for static sites or JAMstack + API functions, but this project
  needs a full backend + database, so App Service is the better fit.
- **Function App**: for event-driven serverless functions, not a traditional persistent
  backend server.
- **Azure SQL / Cosmos DB**: valid options, and worth learning eventually, but add more setup
  friction (connection strings, firewall rules, native auth) than Supabase for a first POC.

## Zero-to-Deployed Step Guide

1. **Scaffold the project locally**
   `npx create-next-app@latest my-poc-site` (TypeScript or JS, App Router, Tailwind optional).
   Confirms a working local site at `localhost:3000` before writing custom code.

2. **Set up Supabase and the schema**
   Create a project at supabase.com. Define tables via the SQL editor or Supabase CLI — even
   one simple table is enough for a POC. Grab the Project URL, anon key, and service role key
   from Settings → API.

3. **Wire Supabase into the app**
   `npm install @supabase/supabase-js`. Create `.env.local` with the Supabase URL and keys.
   Build a Supabase client file and a basic CRUD flow (list + add rows).
   **Never commit `.env.local`** — Next.js gitignores it by default.

4. **Test everything locally**
   `npm run dev`. Click through the real flow: load data, submit a form, confirm it persists.
   Fix bugs here — it's the cheapest place to catch them, before Azure is involved.

5. **Push the code to GitHub**
   Create a repo on the personal GitHub account, `git init`, commit, push to `main`. This is
   the repo Azure will deploy from.

6. **Create the Azure Web App resource**
   In the Azure Portal: Create a resource → Web App. Free (F1) tier. Runtime stack: Node.js.
   Don't connect GitHub yet — do that deliberately in the next step.

7. **Connect GitHub Actions and set production env vars**
   In the Web App's Deployment Center, connect the GitHub repo/branch — Azure auto-generates a
   GitHub Actions workflow that builds and deploys on every push. In Configuration →
   Application settings, add the **production** Supabase URL/keys as environment variables
   (separate from local `.env.local` — these do NOT sync automatically).

8. **Deploy, verify, and iterate**
   Push a commit, watch the Actions tab build and deploy. Open the `*.azurewebsites.net` URL
   and confirm the same flow works in production. From here, every push to `main` auto-deploys.

## Gotchas to remember
- Local `.env.local` and Azure's Application Settings are two separate places — if it works
  locally but breaks in production, check the Azure env vars first.
- Create the Web App resource *before* connecting GitHub, so runtime/region settings are
  deliberate rather than rushed through a combined wizard.
- Free tiers: Azure App Service F1 and Supabase's free tier are both fine for a POC's traffic
  and storage needs.

## Open item
Site content/purpose hasn't been decided yet — the plan above works with a placeholder concept
and can be pointed at the real idea once it's picked.
