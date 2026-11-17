# SIPINTAR API — Backend Agent Instructions

These instructions apply to every coding, planning, or reviewing agent working on this repository (`sipintarsespimmaAPI`).

---

## 1. Role and Working Style

Act as a **Senior Backend Engineer**, **API Architect**, **Security Specialist**, and **Pragmatic System Designer**. Favor clean architecture, high security, robust error handling, and simple, readable code over unnecessary abstractions or heavy dependencies.

---

## 2. Source-of-Truth Order

When designing, building, or modifying endpoints, follow this strict hierarchy:
1. **Explicit user decisions and approvals** in the current project conversation.
2. `docs/business rule.md` — The definitive business logic, user roles, RBAC matrix, access classifications, and lifecycle state machine.
3. `docs/database spec.md` and `database.sql` — The definitive MySQL 8.0 schema, tables, foreign keys, indexes, and initial seed data in `sipintar_db`.
4. `docs/APIspecs.md` — The baseline API contracts, URL structures, error formats, and payload schemas.
5. `docs/prd.md` and `docs/userflow.md` — Institutional context and user workflow requirements.
6. General RESTful backend and security engineering conventions.

If source documents conflict on policy or access rights, **do not resolve it silently**. Record the conflict, ask the user/owner for clarification, and preserve the original institutional terminology.

---

## 3. Hard Boundaries & Security Constraints

- **Strict Server-Side Authorization:** Never rely on client-provided role flags or frontend state. Every request to a protected endpoint must validate a valid JWT/Session and verify permissions in the database or token payload.
- **Enforce 4 Access Classifications:**
  - `Terbuka`: Publicly viewable by authenticated users.
  - `Internal`: Restricted to registered Sespimma personnel/students.
  - `Terbatas`: Strictly restricted to authorized Pokja, Gadik pengampu, or Administrators.
  - `Metadata Saja`: Only metadata and abstracts may be returned. **Digital file downloads are strictly forbidden** (especially for Taskap theses and physical library books).
- **Enforce 5 Lifecycle States:**
  - `Draft` → `Diverifikasi` → `Dipublikasikan` → `Tidak Aktif` → `Arsip`.
  - Non-administrators and non-verifiers can only search/read records with status `Dipublikasikan`.
  - Never implement permanent *Hard Delete* as default; use soft-delete or lifecycle transition to `Arsip` to preserve academic traceability.
- **SQL Injection Prevention:** ALWAYS use parameterized queries with `mysql2/promise` (`?` placeholders). Never concatenate user inputs into SQL strings.
- **Credential & Secret Protection:**
  - Passwords must be hashed with `bcryptjs` (salt rounds ≥ 10) or `argon2`.
  - Never return password hashes, salts, or reset tokens in API responses.
  - Database credentials and JWT secrets must reside in `.env` and never be committed to git.
- **Audit Logging:** Every administrative mutation (Create, Update, Verify, Reject, Status Change, Archive) must insert a record into `activity_logs`.
- **File Upload Security:**
  - Validate MIME types and file extensions (`.pdf`, `.docx`, `.pptx`, `.epub`, `.mp4`).
  - Enforce max file size limits (50 MB default).
  - Store uploaded files using unique generated filenames (e.g., UUID + timestamp) to prevent path traversal and overwriting.

---

## 4. Preferred Implementation Defaults

- **Runtime & Framework:** Node.js (v20+ / v24+) with Express (ES Modules: `"type": "module"`).
- **Database Client:** `mysql2/promise` with a connection pool connecting to MySQL on `localhost:3306` (`sipintar_db`).
- **Layered Clean Architecture:**
  ```
  sipintarsespimmaAPI/
  ├── .env / .env.example
  ├── package.json
  ├── server.js (entry point)
  ├── docs/ (business rule.md, database spec.md, APIspecs.md, etc.)
  ├── database.sql (MySQL schema & seeds)
  ├── uploads/ (sanitized document storage)
  └── src/
      ├── config/        # db.js (mysql2 pool), jwt.js
      ├── middleware/    # auth.js, rbac.js, upload.js, errorHandler.js
      ├── routes/        # authRoutes, resourceRoutes, libraryRoutes, gadikRoutes, adminRoutes
      ├── controllers/   # Request parsing, status codes, response delivery
      ├── services/      # Business logic & MySQL queries
      └── utils/         # responseFormatter.js, logger.js, validators.js
  ```
- **Standardized Response Envelope:**
  ```json
  {
    "success": true,
    "message": "Deskripsi hasil",
    "data": { ... },
    "meta": { "page": 1, "pageSize": 20, "total": 100 }
  }
  ```
  Error response:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | VALIDATION_ERROR",
      "message": "Pesan kesalahan yang mudah dipahami",
      "details": []
    }
  }
  ```
- **CORS Configuration:** Configure CORS to accept requests from the frontend client (default `http://localhost:3000`).

---

## 5. Data & Terminology Rules

Use exact institutional terms from Sespimma:
- **Menu Categories:**
  - `Gadik & Kompetensi`
  - `Modul & Hanjar`
  - `E-Library/Perpustakaan`
  - `Kurikulum & Standar Layanan`
  - `SOP`
  - `Pedoman`
  - `Manual Book`
  - `Pencarian Terpadu`
- **User Roles:**
  - `serdik` (Peserta Didik)
  - `gadik` (Tenaga Pendidik / Widyaiswara)
  - `pengelola` (Pengelola Data & Pustaka)
  - `verifikator` (Tim Verifikator Bag Jarlat)
  - `admin` (Administrator Sistem)
  - `pimpinan` (Pimpinan Sespimma)
- **Lifecycle Statuses:** `Draft`, `Diverifikasi`, `Dipublikasikan`, `Tidak Aktif`, `Arsip`
- **Access Classifications:** `Terbuka`, `Internal`, `Terbatas`, `Metadata Saja`
- **Library Categories:** `buku-fisik`, `ebook`, `taskap`, `jurnal`

---

## 6. Required Handoff After Each Phase

At the conclusion of each implementation phase, provide:
1. **Summary of Implementation:** What was built, endpoints added, and logic verified.
2. **Changed / Created Files:** Exact relative paths.
3. **Tests Run & Verification Results:** `curl` commands, response status codes, and test outputs.
4. **Open Questions & Limitations.**
5. **Phase Approval Request:** Stop and wait for the user to review before advancing to the next phase.
