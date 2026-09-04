# Base proyectos

Data Dept hub — a single static page that lists every project I'm working on,
tracks status/priority, and (as of this iteration) collects incoming feature
requests from stakeholders across the company.

Deployed at **base-proyectos-nu.vercel.app**.

Three files carry the whole app:

| File | Purpose |
| --- | --- |
| `index.html` | The hub itself — two-view switcher (Proyectos \| Requests), status strip, project list, priorities sidebar, and the admin board for incoming requests. |
| `request.html` | Public-facing submission form at `/request.html`. Anyone with the link can drop a request. |
| `config.js` | Shared config — Supabase URL/key, the curated project dropdown, and priority metadata. Loaded by both pages. |

---

## Feature Requests

A lightweight intake channel so stakeholders can ask the Data Dept for work
without needing a Slack DM or a meeting.

### What it is

- **Public form** at `/request.html` — anyone at the company can submit.
  Warm-charcoal + terracotta card with project dropdown, description,
  priority (Quick / Medium / Urgent), name, optional email. Submits straight
  to Supabase.
- **Admin board** inside the hub — a "Requests" tab next to "Proyectos" on
  the main page. Gated by Supabase email/password auth. Shows three columns
  (Nueva / En progreso / Hecha) with filters for priority and project, and
  lets me edit `admin_notes` inline.

### Flow

1. **Stakeholder submits** at `/request.html`. Row lands in `public.requests`
   with `status = 'new'`.
2. **Weekly review** — I open the hub, switch to the Requests tab, sign in,
   and triage what came in that week. If something's unclear I follow up on
   the email they left.
3. **Status moves** as work progresses:
   - `Nueva` → `En progreso` when I start it
   - `En progreso` → `Hecha` when it ships
   - `Rechazada` is available as a fourth column if I need to decline
4. **Internal notes** go in the `admin_notes` field on each card — visible
   only to signed-in admins, never to the submitter.

### Adding a project to the dropdown

Edit `REQUEST_PROJECTS` in `config.js` — it's a plain array of strings. The
list is intentionally curated (not the hub's internal project list) so
stakeholders only see things they can meaningfully request work on. Keep
`"Other / New idea"` last as the catch-all.

```js
window.REQUEST_PROJECTS = [
  "Booked vs Budget",
  "Canada Gradeout Pipeline (GDS)",
  // ...
  "Other / New idea"   // keep last
];
```

Both the public form's dropdown and the admin board's project filter read
from the same array, so one edit updates both surfaces.

### Security model

The Supabase key committed to `config.js` is the **publishable / anon key**.
It's safe to expose in a public repo and in browser-shipped JS because the
Postgres role it maps to (`anon`) has *insert-only* access to
`public.requests` — enforced at two layers:

- **Postgres grants**: `anon` has `INSERT` only. It cannot `SELECT`,
  `UPDATE`, or `DELETE`.
- **RLS policies** on `public.requests` reinforce the same at row level.

The admin board uses Supabase email/password auth to sign in as an
`authenticated` user, which has `SELECT`, `UPDATE`, `INSERT` on the same
table. That's how the same publishable key can safely power both the public
form and the admin view — the capability difference lives in the role, not
the key.

**Role summary:**

| Role | Can do | Used by |
| --- | --- | --- |
| `anon` | `INSERT` only | Public form at `/request.html` |
| `authenticated` | `SELECT`, `UPDATE`, `INSERT` | Admin Requests tab in the hub |

The service-role key is never used client-side and is not in this repo.
