# SIPINTAR — UI Guidelines

**Status:** Draft v1.0 — awaiting user approval  
**Design direction:** Institutional, modern, calm, information-dense but not crowded.

## 1. Visual principles

- **Trustworthy:** institutional blue, clean surfaces, clear labels.
- **Scannable:** resource categories and administrative status are easy to distinguish.
- **Responsive:** preserve the content hierarchy instead of shrinking desktop into a tiny screen.
- **Accessible:** keyboard focus, readable type, sufficient contrast, touch targets.
- **Low complexity:** use a small token set and repeatable components, not one-off styling.
- **Faithful to source:** keep the official feature vocabulary and avoid implying unavailable capabilities.

## 2. Brand and color tokens

Use the following as **initial design tokens**, not official brand specifications. Confirm exact official colors/assets with the owner before final release.

### Light theme
- Primary blue: `#1557B7`
- Primary hover: `#0E4699`
- Bright action blue: `#2878F0`
- Navy text: `#102A56`
- Main background: `#F4F8FD`
- Surface/card: `#FFFFFF`
- Border: `#D9E4F2`
- Main text: `#172B4D`
- Muted text: `#5F7190`
- Success: `#16834A`
- Warning: `#B86A08`
- Danger: `#C43D4B`
- Focus ring: `#77A9FF`

### Dark theme
- Main background: `#0B1220`
- Surface/card: `#121D30`
- Raised surface: `#18263D`
- Border: `#2A3B56`
- Main text: `#E8F0FC`
- Muted text: `#A7B7D0`
- Primary blue: `#6EA8FF`
- Primary action: `#3478E5`

Do not rely on color alone for status: combine color with text/icon.

## 3. Typography

- Preferred system stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Brand wordmark may use a stronger weight; do not recreate official logos as text if an approved asset exists.
- Page title: 24–32px desktop; 22–26px mobile.
- Section heading: 16–20px.
- Body: 14–16px.
- Metadata/caption: 12–13px, with readable contrast.
- Line height: 1.45–1.65 for body text.
- Avoid tiny labels below 12px except nonessential decorative metadata.

## 4. Layout and breakpoints

Use responsive CSS breakpoints as implementation defaults:
- Mobile: `< 640px`
- Tablet: `640px–1023px`
- Desktop: `>= 1024px`
- Wide desktop: `>= 1440px`

Suggested desktop shell:
- Header: compact, approximately 64–84px depending on brand banner.
- Sidebar: 224–256px; collapsible.
- Content: fluid with a sensible max width.
- Grid: 6 cards may display in a row only on wide screens; progressively use 3/2/1 columns.
- Main gutters: 24px desktop, 16px tablet, 12–16px mobile.
- Use `min-width: 0` on grid/flex children and allow long titles to wrap.

Mobile behavior:
- Sidebar becomes a drawer or compact bottom/side navigation; do not keep a fixed desktop sidebar that consumes the viewport.
- Search is full width.
- Hero text remains readable and does not depend on text over a busy image.
- Category cards use 1–2 columns depending on available width.
- Admin shortcuts wrap into a grid/list.
- Tables become stacked cards or horizontally scroll within a clearly bounded region.
- Touch target aim: 44×44 CSS px.

## 5. Components

### App shell
- Header: brand, global search, notifications (decorative/mock), profile menu.
- Sidebar: active item, icon, text label, tooltip only when collapsed.
- Main: breadcrumb if needed, page heading, content.
- Mobile: drawer open/close control with accessible name and Escape handling.

### Hero / welcome panel
- Institutional building image may be used as a background only if supplied/approved.
- Use a dark/white overlay or gradient so text remains legible.
- Keep headline, one-sentence explanation, and optional primary action.
- Do not stretch or crop official marks in a way that distorts them.

### Resource category card
- Icon in a tinted tile, category title, short explanation, optional count.
- Whole card clickable only if its action is clear.
- Hover and focus states should be subtle and consistent.
- Avoid using a different visual system for every category; use restrained accent tints.

### Resource list item
- Title, category, author/owner when approved, last-updated date if available, verification status, access classification.
- Display “Akses digital tersedia” only when mock data explicitly says the digital asset exists and access is permitted.
- Otherwise show “Metadata tersedia” or “Akses digital tidak tersedia” as appropriate.

### Status chips
- Draft / Draft
- Diverifikasi
- Dipublikasikan
- Tidak Aktif
- Arsip
- Access: Terbuka, Internal, Terbatas, Metadata Saja
- Always include visible text; never encode status solely through color.

### Forms and dialogs
- Persistent labels; inline validation; helpful error copy.
- Destructive or publication actions require confirmation in prototype flows.
- Prototype actions update local state only and must not imply persistence on a server.

### Feedback states
- Loading skeletons for lists.
- Empty state with next action.
- No results state with query/filter reset.
- Error state with retry/help guidance.
- Toasts for local prototype interactions.

## 6. Iconography and imagery

- Use one coherent line-icon family (e.g. Lucide) if available in the project.
- Do not mix filled, outline, and emoji icons arbitrarily.
- Use official crest/brand assets only if supplied and permitted.
- Use neutral placeholder thumbnails for books/materials where real approved covers are unavailable.
- Avoid using real personal profile photos in mock content; use neutral placeholders or initials.
- Provide useful `alt` text for meaningful images; decorative images use empty alt text.

## 7. Accessibility checklist

- [ ] Semantic landmarks: header, nav, main, footer where applicable.
- [ ] Every input has a visible label or accessible name.
- [ ] Interactive controls work by keyboard.
- [ ] Focus ring visible in both themes.
- [ ] Contrast checked for text and controls.
- [ ] Status has text as well as color.
- [ ] Images have appropriate alt behavior.
- [ ] Reduced-motion preference respected.
- [ ] Dialog/drawer focus behavior is usable.
- [ ] Zoom to 200% does not hide essential functionality.

## 8. Content and terminology

Use the labels below consistently:
- Beranda
- Gadik & Kompetensi
- Modul & Hanjar
- E-Library/Perpustakaan (navigation may display “Perpustakaan” if matching approved UI)
- Kurikulum & Standar Layanan
- SOP
- Pedoman
- Manual Book
- Pencarian Terpadu
- Manajemen Data
- Verifikasi
- Hak Akses
- Monitoring

The reference image contains an example Gadik name and book titles. Do not use those as production data without validation and permission. Use obviously fictional mock data for the prototype.

## 9. Motion

- Prefer 120–200ms transitions for hover, drawer, and theme changes.
- Avoid parallax, excessive gradients, continuous animation, or motion that delays core tasks.
- Respect `prefers-reduced-motion`.

## 10. Design approval checklist

- [ ] Brand lockup and image treatment approved.
- [ ] Color tokens approved or replaced with official palette.
- [ ] Desktop dashboard approved.
- [ ] Mobile navigation approved.
- [ ] Dark theme approved.
- [ ] Accessibility and empty/error states reviewed.
