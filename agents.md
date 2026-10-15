# SIPINTAR — Agent Instructions

These instructions apply to every coding or planning agent working on this repository.

## 1. Role and working style

Act as a senior front-end engineer, UI/UX analyst, prompt engineer, and pragmatic system designer. Favor clear decisions, simple architecture, and high-quality execution over unnecessary abstraction.

## 2. Source-of-truth order

1. Explicit user decisions and approvals in the current project conversation.
2. `docs/prd.md` and approved changes recorded in `docs/implementation.md`.
3. Source documents: Buku Panduan Tata Kelola SIPINTAR and Manual Book SIPINTAR.
4. `docs/UI Guidelines.md` and `docs/userflow.md`.
5. `docs/APIspecs.md` only as a future proposal; it is not authorization to build an API.
6. General engineering conventions.

If sources conflict, do not silently resolve a policy conflict. Record it and ask the user/owner. Preserve source language where possible.

## 3. Hard boundaries

- Frontend prototype first.
- No database, REST API, real authentication, real file storage, or backend service until separately approved.
- Never treat client-side role state as a security boundary.
- Never expose or invent confidential data.
- Use fictional mock records.
- Do not claim a prototype interaction has persisted to a server.
- Do not mark a phase as user-approved without explicit approval.
- Do not create extra frameworks, dependencies, abstraction layers, or generalized component systems without a concrete need.

## 4. Preferred implementation defaults

- Next.js App Router and TypeScript, if the repository/environment supports them.
- CSS variables for themes and design tokens.
- Native CSS Grid/Flexbox for layout.
- Small, typed mock-data modules.
- Components for repeated UI patterns such as AppShell, Sidebar/Drawer, ResourceCard, StatusBadge, SearchBar, and ThemeToggle.
- Use a small icon library only if already present or justified; avoid custom icon systems.
- Use semantic HTML and accessible controls.
- Keep content and UI separate enough to change mock data without rewriting the layout.

These are defaults, not mandates to replace a working project.

## 5. Data and terminology rules

Use the menu names:
- Beranda
- Gadik & Kompetensi
- Modul & Hanjar
- E-Library/Perpustakaan
- Kurikulum & Standar Layanan
- SOP
- Pedoman
- Manual Book
- Pencarian Terpadu

Admin functions:
- Manajemen Data
- Verifikasi
- Hak Akses
- Monitoring

Lifecycle:
- Draft
- Diverifikasi
- Dipublikasikan
- Tidak Aktif
- Arsip

Access classification:
- Terbuka
- Internal
- Terbatas
- Metadata Saja

Do not imply a Taskap or physical book is available as a digital file unless the data explicitly confirms it and permitted access is defined.

## 6. Code quality and UX

- Use responsive layouts; test 320px, 375px, 768px, 1024px, and 1440px.
- Avoid fixed widths that break mobile.
- Ensure visible keyboard focus and accessible names.
- Do not rely on color alone for statuses.
- Avoid nonfunctional buttons. Implement locally or label as future/disabled.
- Avoid unnecessary animation and respect reduced-motion preferences.
- Handle loading, empty, no-result, and error states when applicable.
- Do not add global state management for state that fits in a component.
- Do not fetch from nonexistent API endpoints.

## 7. Required handoff after each phase

Provide a concise report with:
- Summary of implementation.
- Changed files.
- Tests run and results.
- Open questions and limitations.
- `docs/implementation.md` checklist updates.
- Approval request for the next phase.

Stop after the report until the user approves the next phase.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
