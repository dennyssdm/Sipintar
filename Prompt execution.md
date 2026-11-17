# SIPINTAR API — Prompt Execution Guide

Use this file as the primary execution prompt when working with an AI coding agent to build, maintain, or extend the SIPINTAR Sespimma REST API. Read `agent.md` and the complete `docs/` folder first.

---

## Master Prompt

You are a **Senior Backend Engineer**, **API Architect**, **Security Specialist**, and **Anti-Overengineering Pragmatic Developer**. Build the RESTful API service for **SIPINTAR** (Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif) for Sespimma Sespim Lemdiklat Polri, located at:
`Macintosh HD/Applications/XAMPP/xamppfiles/htdocs/sipintarsespimmaAPI`

Your work is governed by:
- `agent.md` — Core role, security rules, and code quality boundaries.
- `docs/business rule.md` — Official user roles, RBAC matrix, access classifications, and lifecycle states.
- `docs/database spec.md` — MySQL 8.0 schema, tables, foreign keys, and indexes.
- `docs/APIspecs.md` — API endpoint specifications and payload structures.
- `docs/prd.md` and `docs/userflow.md` — System purpose, user flows, and institutional context.
- `database.sql` — Pre-seeded MySQL database `sipintar_db` running on local XAMPP (`localhost:3306`).

---

## Non-Negotiable Execution Constraints

1. **Database & Connection:** Connect to MySQL database `sipintar_db` running on XAMPP (`localhost:3306`, user: `root`, password: `""` or from `.env`). Do NOT alter existing seed data unnecessarily.
2. **Layered Architecture:** Use Node.js with Express (ES Modules: `"type": "module"`). Structure code cleanly into `config/`, `middleware/`, `routes/`, `controllers/`, `services/`, and `utils/`.
3. **Phase-by-Phase Approval:** Work strictly on one phase at a time. After completing a phase, test all routes with `curl`, report results, and STOP. Do not advance to the next phase without explicit user approval.
4. **Zero SQL Injection:** ALWAYS use parameterized queries with `mysql2/promise` (`?` placeholders). Never build SQL statements via string concatenation.
5. **Strict RBAC Enforcement:** Validate JWT tokens and check user roles on EVERY protected endpoint. Never trust role parameters passed in the request body or headers.
6. **Enforce Access Classifications:**
   - `Terbuka`: Authenticated access.
   - `Internal`: Sespimma / Polri personnel only.
   - `Terbatas`: Restricted Pokja, Gadik pengampu, or Admin only.
   - `Metadata Saja`: Abstract & metadata only. **Never allow file downloads for Taskap theses or physical books.**
7. **Lifecycle Integrity:** Serdik and public users may only see resources with `lifecycle_status = 'Dipublikasikan'`. Never execute a physical *Hard Delete* on resources; transition to `Arsip` instead.
8. **Audit Trail Compliance:** Every administrative mutation (Create, Update, Verify, Reject, Status Change, Archive) must insert a record into `activity_logs`.
9. **CORS & Environment:** Enable CORS for the Next.js frontend (`http://localhost:3000`). Store all secrets and ports in `.env`.
10. **Clean Error Handling:** Catch all asynchronous exceptions; return standard JSON error envelopes with accurate HTTP status codes (200, 201, 400, 401, 403, 404, 500). Never crash the Express process.

---

## 6-Phase Implementation Roadmap

### Phase 1 — Project Foundation & Database Connection
- [x] Initialize `package.json` with dependencies: `express`, `mysql2`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`, `morgan`, and `multer`.
- [x] Create `.env` and `.env.example` with `PORT=5001`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_USER=root`, `DB_PASS=`, `DB_NAME=sipintar_db`, `JWT_SECRET`.
- [x] Build `src/config/db.js` with `mysql2/promise` connection pool and connection verification.
- [x] Build basic Express application with JSON parser, CORS, Morgan logger, and error handling middleware.
- [x] Implement `GET /api/v1/health` returning database connection status and server timestamp.
- [x] **Verification:** Run server and test `GET /api/v1/health` via `curl`.

### Phase 2 — Authentication & RBAC Middleware
- [x] Implement `POST /api/v1/auth/login` (accepts `nrp_nip` or `email`, validates `password_hash` with `bcryptjs`, returns JWT token with user id, name, role, and permissions).
- [x] Implement `GET /api/v1/auth/me` (returns current user profile based on JWT).
- [x] Implement `POST /api/v1/auth/register` (for Serdik and Gadik self-registration aligned with `user_profiles_serdik` and `user_profiles_gadik`).
- [x] Build middleware `verifyToken.js` and `checkRole.js` (`['admin']`, `['gadik', 'admin']`, etc.).
- [x] **Verification:** Test login for Admin, Gadik, Serdik, and Verifikator; test token rejection on invalid credentials.

### Phase 3 — Core Resource & Unified Search API
- [x] Implement `GET /api/v1/categories` and `GET /api/v1/categories/:id/subcategories`.
- [x] Implement `GET /api/v1/resources` (supports pagination, filtering by `category_id`, `lifecycle_status`, `access_classification`).
- [x] Implement `GET /api/v1/resources/:id` (returns complete detail, tags, and instructor metadata).
- [x] Implement `GET /api/v1/gadik` (returns list of 16 fungsional Polri Gadik, competencies, and nominatif summary).
- [x] Implement `GET /api/v1/gadik/:id` (detailed competence profile, teaching subjects, and Sprin data).
- [x] Implement `GET /api/v1/library/categories` and `GET /api/v1/library/books` (with category, author, and stock filtering).
- [x] Implement `GET /api/v1/search` (executes MySQL `FULLTEXT` search across resources and books with relevance ranking).
- [x] **Verification:** Query resources, verify `FULLTEXT` keyword search across multiple categories.

### Phase 4 — Document Reader & File Streaming API
- [x] Implement `GET /api/v1/library/books/:id/preview` (serves the 10–20 page sample preview file safely).
- [x] Implement `GET /api/v1/resources/:id/file` (streams or securely serves PDF/DOCX file only if user access matches classification).
- [x] Add protective guard: if `access_classification === 'Metadata Saja'`, reject download with `403 FORBIDDEN` and message: "Berkas digital tidak tersedia untuk publik. Silakan akses fisik di perpustakaan/ruang baca."
- [x] Configure `multer` in `src/middleware/upload.js` for sanitized PDF/DOCX uploads.
- [x] **Verification:** Verify that sample preview works, internal files require auth, and `Metadata Saja` files are blocked.

### Phase 5 — Governance & Administration Modules
- [x] **Manajemen Data:**
  - `POST /api/v1/admin/resources` (create draft resource with uploaded file).
  - `PUT /api/v1/admin/resources/:id` (edit metadata).
  - `PATCH /api/v1/admin/resources/:id/archive` (transition lifecycle to `Arsip`).
- [x] **Verifikasi Naskah:**
  - `GET /api/v1/admin/verification/queue` (list items with status `Draft` or `Diverifikasi`).
  - `POST /api/v1/admin/verification/:id/review` (approve to `Dipublikasikan` or reject to `Draft` with review notes in `verification_logs`).
- [x] **Hak Akses & Akun:**
  - `GET /api/v1/admin/users` (list users with role filters).
  - `PATCH /api/v1/admin/users/:id/role` (update user role).
  - `PATCH /api/v1/admin/users/:id/status` (activate/deactivate account).
- [x] **Monitoring & Audit Logs:**
  - `GET /api/v1/admin/monitoring/stats` (counts by category, lifecycle, and access classification).
  - `GET /api/v1/admin/monitoring/logs` (query `activity_logs` and `search_logs`).
- [x] **Verification:** Execute draft creation, approval cycle, verify log entry in `activity_logs`.

### Phase 6 — Hardening, API Documentation & Frontend Handover
- [x] Generate Postman Collection (`SIPINTAR_Sespimma_API.postman_collection.json`) with sample requests and environment variables.
- [x] Ensure helmet security headers, rate limiting (`express-rate-limit`), and input sanitization.
- [x] Test integration with the Next.js frontend by updating frontend fetch services.
- [x] Document final running instructions in `README.md`.

---

## Execution Sequence

```
Inspect Environment ──► Confirm Phase ──► Implement Slice ──► Validate via curl ──► Report & Stop
```

### Step A — Inspect
- Inspect the current files in `sipintarsespimmaAPI`.
- Verify Node.js and npm versions.
- Verify MySQL connectivity to `sipintar_db` on `localhost:3306`.

### Step B — Confirm the Current Phase
- Check the phase status in the implementation plan.
- Always work on the lowest uncompleted phase.
- Do not skip ahead.

### Step C — Implement
- Write clean, modular, and typed JavaScript (ES Modules).
- Keep dependencies minimal: `express`, `mysql2`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`, `morgan`, `multer`.
- Implement parameterized database calls in dedicated services.

### Step D — Validate
- Start the server (`node server.js` or `npm run dev`).
- Run explicit `curl` commands testing success paths, validation errors, and unauthorized access.
- Inspect MySQL tables to verify data mutations and log entries.

### Step E — Report & Stop
Report:
1. Summary of completed work.
2. Created and modified files.
3. Test commands and output responses.
4. Known limitations or open questions.
5. Approval request for the next phase.

**STOP after the report. Do not begin the next phase without explicit user approval.**

---

## Initial Execution Request

To begin, start with **Phase 1: Project Foundation & Database Connection**.
Verify the local XAMPP MySQL `sipintar_db` connection, initialize the Express server structure, create the health check endpoint, test with `curl`, and report the result for approval.

