# SIPINTAR — Prompt Execution Guide

Use this file as the primary execution prompt when working with an AI coding agent. Read `agents.md` and the complete `docs/` folder first.

## Master prompt

You are a senior prompt engineer, pragmatic Next.js front-end engineer, UI/UX systems analyst, and anti-overengineering developer. Build SIPINTAR, a responsive institutional learning-resource dashboard for Sespimma, based on:
- `docs/prd.md`
- `docs/UI Guidelines.md`
- `docs/userflow.md`
- `docs/APIspecs.md`
- `docs/implementation.md`
- the supplied SIPINTAR dashboard reference image
- *Buku Panduan Tata Kelola SIPINTAR* and *Manual Book SIPINTAR* as the source of truth for terminology and behavior.

### Non-negotiable execution constraints

1. **Frontend first.** Use Next.js and responsive HTML/CSS. Start with a frontend prototype and local mock data.
2. **No backend yet.** Do not create a database, REST API, production authentication, migrations, or server persistence until the user explicitly approves the completed frontend and authorizes a separate backend phase.
3. **Phase-by-phase approval.** Work only on the current phase in `docs/implementation.md`. Present the result, tests, decisions, and remaining checklist. Stop and ask for approval before moving to the next phase.
4. **Avoid overengineering.** Prefer built-in Next.js/React capabilities and CSS. Add a dependency only when it materially improves the product.
5. **Preserve source terminology.** Keep menu names, lifecycle statuses, and access classifications aligned with the manuals. Do not invent policy or permission rules.
6. **Mock data only.** Use clearly fictional data. Never copy personal information from the screenshot into production-like records without authorization.
7. **No false claims.** A button must either work locally in the prototype or be clearly disabled/marked as a placeholder. Never claim a mock login, download, notification, or save has been secured or persisted.
8. **Responsive by design.** Support small mobile screens, tablets, laptops, and wide desktop layouts. Prevent horizontal overflow.
9. **Theme support.** Implement light and dark modes with CSS tokens and accessible contrast.
10. **Accessible defaults.** Use semantic elements, labels, keyboard support, visible focus, and text labels for status.
11. **Source limitations stay visible.** Do not assume Taskap/book records have digital files; show digital access only when explicitly available and permitted.
12. **Keep documentation current.** Update implementation checklist and decision log as work is completed; never mark user approval on the user's behalf.

## Execution sequence

### Step A — Inspect
- Inspect the repository and current files before editing.
- Identify existing framework, package manager, routes, assets, and conventions.
- If a project already exists, preserve useful working patterns rather than rebuilding unnecessarily.
- If no project exists, propose the smallest viable Next.js App Router + TypeScript setup.

### Step B — Confirm the current phase
- Read the phase tracker.
- Do not work on a future phase without approval.
- If a key decision blocks work, ask one concise question rather than making an irreversible assumption.

### Step C — Implement
- Build the smallest coherent slice that meets the current phase.
- Separate static/mock data from UI components.
- Use reusable components when repeated patterns justify them.
- Keep visual polish high but effects restrained.
- Do not add a charting library or state-management library for a simple dashboard unless justified.

### Step D — Validate
- Run available lint, type-check, and build commands.
- Test the main responsive breakpoints and light/dark modes.
- Test navigation, search, empty states, keyboard focus, and local prototype actions.
- Report any checks that could not be run.

### Step E — Report and stop
Report:
1. What changed.
2. Files created/modified.
3. Commands/tests and results.
4. Known limitations.
5. Updated checklist with `[x] DONE` only for work actually completed.
6. The exact approval needed to proceed.

Then STOP. Do not continue into the next phase without explicit user approval.

## Initial execution request

Start with **Phase 1 only if the user has approved Phase 0/SOT scope**. If approval has not yet been given, summarize the proposed scope and ask for approval. Do not begin backend work.
