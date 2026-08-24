# Dentist Hospital CRM

A multi-tenant CRM for dental clinics — patient records, scheduling, and (in later
phases) billing and treatment history. Built to replace manual/paper-based
front-desk operations.

## Stack

- **Server**: Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT auth
- **Client**: React (Vite), TypeScript, React Router

## Multi-tenancy

Every clinic that signs up becomes a `Tenant`. All data (users, patients,
appointments, audit logs) is scoped by `tenantId`, enforced in every query in
the API layer — never trust a client-supplied tenant ID. A JWT is issued per
user and carries `{ userId, tenantId, role }`; every authenticated route reads
the tenant from the verified token, not from request params or body.

Roles: `ADMIN`, `DENTIST`, `FRONT_DESK`. Admins manage staff; front desk and
admins can create/edit patients and book appointments; dentists can view
patients and update appointment status.

## Project structure

```
server/   Express API + Prisma schema
client/   React frontend (Vite)
```

## Local setup

1. Start Postgres:
   ```
   docker compose up -d
   ```
2. Server:
   ```
   cd server
   cp .env.example .env      # edit JWT_SECRET before any real deployment
   npm install
   npx prisma migrate dev --name init
   npm run dev                # http://localhost:4000
   ```
3. Client:
   ```
   cd client
   npm install
   npm run dev                # http://localhost:5173
   ```
4. Open the client, register a clinic (creates a Tenant + ADMIN user), then
   log in. As admin, add a dentist under **Staff** before booking
   appointments (a booking needs a dentist to assign it to).

## PII & security — what's in place, and what's still needed before production

Dental records contain sensitive personal/health data, not just contact
details. Implemented so far:

- Passwords hashed with bcrypt (never stored/logged in plaintext).
- JWT-based auth; every data query is scoped to the authenticated user's
  tenant — one clinic can never read another's records.
- Role-based access control on write endpoints (e.g. only `ADMIN` can create
  staff accounts).
- `AuditLog` table recording who viewed/created/updated a patient record and
  when — required for any medical-data system and for dispute resolution.
- Explicit `consentGiven` / `consentGivenAt` fields on `Patient`, separate
  from the rest of the record, so consent is tracked rather than assumed.
- Input validation (zod) on every write endpoint.

Still needed before handling real patient data in production:

- **Field-level encryption** for `medicalHistory` and any future
  attachments (X-rays, scans) — current schema stores it as plain text in
  Postgres, encrypted only via disk/volume encryption.
- **Transport security**: TLS termination in front of the API (not handled
  by this app itself).
- **Data retention & deletion workflow**: a process for right-to-erasure
  requests that respects locally-mandated medical-record retention periods.
- **Rate limiting / brute-force protection** on `/api/auth/login`.
- **Backups**: encrypted, tested restore process for the Postgres database.
- **Compliance review** against India's DPDP Act 2023 (consent language,
  breach notification process, data principal rights) and any applicable
  medical-council record-keeping rules.
- Care with any SMS/WhatsApp/email reminder integration: message bodies
  should never include clinical details (diagnosis, treatment type), only
  neutral appointment confirmations.

## Roadmap

- [x] Phase 1: Patient registration + appointment scheduling (this scaffold)
- [ ] Phase 2: Billing/invoicing + treatment history & dental charting
- [ ] Phase 3: Automated reminders/recalls + reporting dashboards
- [ ] Phase 4: Insurance claims, inventory, multi-branch reporting
