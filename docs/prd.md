# SIPINTAR — Product Requirements Document (PRD)

**Status:** Draft v1.0 — awaiting user approval  
**Product:** SiPINTAR — Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif  
**Tagline:** Mengintegrasikan Pengetahuan, Mengaselerasikan Kepemimpinan  
**Primary release:** Frontend prototype only  
**Owner/context:** Sespimma Sespim Lemdiklat Polri  
**Source basis:** *Buku Panduan Tata Kelola SIPINTAR* (2026), *Manual Book SIPINTAR* (2026), and supplied dashboard reference image.

## 1. Product summary

SIPINTAR is a responsive web interface for discovering and managing learning-resource information for Sespimma. It is a governance and access-information ecosystem, not merely a digital library and not a replacement for every existing learning platform.

The first delivery is a **frontend-only experience** with realistic mock data. No production database, authentication service, REST API, or real document storage is to be implemented until the user approves the frontend phase and separately authorizes backend planning.

## 2. Goals

1. Provide a clear dashboard entry point to learning-resource categories.
2. Make cross-category discovery easy through a unified search experience.
3. Reflect the governance lifecycle: Draft → Diverifikasi → Dipublikasikan, plus Tidak Aktif/Arsip.
4. Communicate role-sensitive access and the four access classifications: Terbuka, Internal, Terbatas, Metadata Saja.
5. Give administrators a clear visual entry point to Manajemen Data, Verifikasi, Hak Akses, and Monitoring.
6. Deliver a polished blue-and-white institutional design, with light and dark themes.
7. Scale gracefully from desktop to mobile without horizontal overflow.
8. Keep the implementation understandable, testable, and intentionally small.

## 3. Non-goals for Phase 1

- Production database or backend REST API.
- Real login, password validation, password reset, or session management.
- Real file uploads/downloads or access-control enforcement.
- Live analytics, audit logs, notification delivery, or integrations.
- Digitizing all physical books or implying all Taskap/books have digital files.
- Inventing institutional roles, permissions, policies, data, or approval authority not stated in source documents.

These must be treated as prototype interactions only, with visible mock/demo labeling where appropriate.

## 4. Users and role concepts

The source manuals describe these user groups:
- **Serdik/pengguna internal:** search and access learning information according to granted rights.
- **Gadik/tenaga pendidik:** maintain/find relevant competence and learning-resource information according to authority.
- **Pengelola perpustakaan/pengelola data:** update resource metadata according to assigned duties.
- **Administrator:** manage data, accounts/access rights, verification, and monitoring according to authorization.
- Governance roles described in the governance guide include pimpinan/penanggung jawab, project leader/pengelola, administrator, data manager, verifier/authorized manager, library manager, Gadik, and Bag Jarlat/learning manager.

The UI may demonstrate role-aware navigation, but must not imply that mock role selection is real authorization.

## 5. Information architecture

Primary navigation, preserving source terminology:
1. Beranda
2. Gadik & Kompetensi
3. Modul & Hanjar
4. E-Library/Perpustakaan (the reference image uses “Perpustakaan”; the governance guide uses “E-Library/Perpustakaan”)
5. Kurikulum & Standar Layanan
6. SOP
7. Pedoman (the reference image also shows “Pedoman”)
8. Manual Book
9. Pencarian Terpadu

Administrator feature shortcuts:
- Manajemen Data
- Verifikasi
- Hak Akses
- Monitoring

A future Taskap category may appear in unified-search filters/results because the Manual Book names Taskap as a search category. It should not be elevated into primary navigation unless approved.

## 6. Dashboard requirements

### P0 — required for initial review
- Institutional SIPINTAR header/brand lockup.
- Sidebar navigation on desktop; collapsible drawer or compact navigation on mobile.
- Search field with clear affordance.
- User profile area and notification icon as prototype elements.
- Welcome/hero section.
- Resource category cards for Gadik & Kompetensi, Modul & Hanjar, E-Library/Perpustakaan, Kurikulum & Standar Layanan, SOP, and Pencarian Terpadu.
- Recent/recommended resource previews using clearly fictional sample content.
- Quick search panels for Gadik, Modul/Hanjar, Buku, and Pencarian Terpadu.
- Administrator shortcut strip/card group.
- Light/dark mode toggle.
- Responsive states and basic keyboard accessibility.
- Empty, loading/skeleton, and no-results states for searchable lists.

### P1 — after initial visual approval
- Category pages with filters and sort controls.
- Detail drawer/page for a resource or Gadik profile.
- Search results with category filter chips.
- Prototype admin table with status and access badges.
- Mock add/edit/verify flows.
- Toast feedback and confirmation dialogs.

### P2 — only if justified and approved
- More advanced dashboards, configurable widgets, saved searches, bulk actions, richer audit views.

## 7. Core functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | User can navigate between primary menu areas. | P0 |
| FR-02 | User can enter a query and see mock search results. | P0 |
| FR-03 | Dashboard shows resource category cards and sample items. | P0 |
| FR-04 | Theme can switch between light and dark. | P0 |
| FR-05 | Layout adapts to mobile, tablet, and desktop. | P0 |
| FR-06 | Resource cards show category, title, and access/verification status where relevant. | P0 |
| FR-07 | UI distinguishes metadata availability from digital-file availability. | P0 |
| FR-08 | Admin shortcuts are visible as prototype affordances. | P0 |
| FR-09 | Category filters and empty states work in mock data. | P1 |
| FR-10 | Admin mock form supports draft/edit/verify preview states. | P1 |
| FR-11 | Prototype clearly states that data and login are not production-connected. | P0 |
| FR-12 | Real access control is enforced only by a future approved backend, not client-side UI. | Future |

## 8. Non-functional requirements

- Responsive layout with no unintended horizontal scroll at 320px and above.
- Good contrast and visible focus states; controls usable by keyboard.
- Use semantic HTML and accessible labels.
- Avoid heavy dependencies and unnecessary global state.
- Prefer server/client boundaries appropriate to Next.js; use client components only where interactivity requires them.
- Use local mock data in a dedicated module.
- Avoid embedding confidential or personal real-world data in mock records.
- UI must not represent a mock event as a real server action.
- Document known limitations and decisions.

## 9. Source-derived content and caveats

The source documents establish the menu taxonomy, data lifecycle, access classifications, user groups, metadata principles, and governance responsibilities. They do **not** establish a live API contract, database schema, production authentication method, exact performance targets, or a full permission matrix. Those remain open decisions.

The governance guide says that Taskap metadata does not imply a digital copy is available; likewise, a book's digital access is shown only when a file exists, its use is allowed, and access rights have been set. The UI must preserve this distinction.

## 10. Acceptance criteria for Phase 1

- [ ] Dashboard visually follows the supplied reference: institutional blue/white, top identity banner, left navigation, search, hero, category cards, resource previews, admin shortcuts.
- [ ] Main content is legible and usable at desktop, tablet, and mobile sizes.
- [ ] Light and dark themes both work and maintain adequate contrast.
- [ ] Main navigation and search operate against mock data.
- [ ] Labels use source terminology consistently.
- [ ] Mock data and prototype-only controls are identified as such.
- [ ] No backend/API/database work has been started.
- [ ] User has reviewed the running frontend and explicitly approved the phase.

## 11. Approval gate

**Gate A — approve information architecture and visual direction.**  
**Gate B — approve responsive frontend and prototype interactions.**  
Only after Gate B is explicitly approved may a separate backend/database/REST API design phase be proposed. Approval of this document is not approval to build backend services.
