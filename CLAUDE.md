# CLAUDE.md — MyRehat Task B: Agent Standing Orders

This file is read automatically by Claude (Anthropic) and Antigravity AI agents on every session.
All directives here are **non-negotiable** and apply to every code edit, bug fix, refactor, or visual refinement in this repository.

---

## 🏗️ PROJECT OVERVIEW

**Stack:** Next.js 15 (App Router) · Elysia (Bun) · Drizzle ORM · PostgreSQL · Better-Auth · oRPC · TanStack Query · Tailwind CSS v4 · Vitest · TypeScript (strict monorepo)

**Workspace layout:**
```
apps/web        — Next.js frontend
apps/server     — Elysia API server
packages/db     — Drizzle schema + migrations
packages/api    — oRPC router
packages/auth   — Better-Auth config
```

---

## ⚙️ ATURAN OTOMATIS PASCA-EKSEKUSI / AUTOMATIC POST-EXECUTION HOOK (NON-NEGOTIABLE)

Setiap kali kamu **SELESAI** melakukan edit kode, perbaikan bug, atau penyempurnaan visual:
After completing **ANY** code edit, bug fix, refactor, or visual refinement:

### 1. Append ke `PROMPT_LOG.md` / Append to `PROMPT_LOG.md`
- WAJIB append prompt dan ringkasan pekerjaan dengan header Log # berurutan.
- Increment the Log # header sequentially (e.g. `## Log #17: ...`).
- Include: timestamp, purpose, list of changed files with clickable markdown links, and a **Status** line.
- Format:
  ```markdown
  ## Log #N: Short Title
  - **Timestamp:** YYYY-MM-DD
  - **Tujuan:** One-sentence purpose.
  ### Rincian Perubahan:
  1. **File** ([path](file:///abs/path)): what changed and why.
  ### Status:
  Done. vitest 32/32 green · tsc 0 errors.
  ```

### 2. Append ke `BUG_EXPLANATION_LOCAL.md` / Append to `BUG_EXPLANATION_LOCAL.md`
- WAJIB append analisis akar masalah, keputusan arsitektur, dan penjelasan teknis.
- Write a section titled `## <Topic> (Log #N)`.
- Include: root-cause analysis, architecture decision rationale, any gotchas or caveats.
- This file is gitignored — write candidly and technically.

### 3. JANGAN PERNAH selesaikan turn tanpa memverifikasi kedua file sudah di-update.
### 3. NEVER finish a turn without verifying both files are updated.

### 4. Pertahankan test suite dan type-checker tetap bersih / Keep the test suite and type-checker clean
- `bunx vitest run` → **32/32 passed** (never regress).
- `tsc` across all workspaces → **0 errors**.
- Mobile viewport 390 px locked — no horizontal overflow.

---

## 🚫 ANTI-SLOP DESIGN RULES (enforced on every UI change)

- **NO** floating badge capsules above headings.
- **NO** three-column symmetrical feature boxes with green checkmarks.
- **NO** marketing purple-prose ("revolutionary", "seamless", "turnkey").
- **NO** font sizes that overflow on 390 px viewport.
- **YES** Airbnb / Linear minimalist aesthetic — depth via shadow, spacing, and micro-typography.
- **YES** Rausch gradient (`from-[#E61E4D] via-[#E31C5F] to-[#D70466]`) for primary CTA buttons.

---

## 🗂️ KEY FILES TO KNOW

| File | Role |
|------|------|
| `PROMPT_LOG.md` | Chronological audit log — append after every task |
| `BUG_EXPLANATION_LOCAL.md` | Deep technical notes — gitignored |
| `tests/waha-webhook.test.ts` | WAHA webhook validation (6 tests) |
| `tests/homestay-categories.test.ts` | 4 accepted + 1 rejected categories (21 tests) |
| `scripts/polish.test.ts` | F4 heading + homepage polish (5 tests) |
| `packages/db/src/schema/homestays.ts` | Source of truth for 4 exact categories |

---

## ✅ VERIFICATION CHECKLIST (run before ending any turn)

```bash
bunx vitest run          # must show 32 passed
cd packages/db  && bun ../../node_modules/typescript/lib/tsc.js -b
cd ../api       && bun ../../node_modules/typescript/lib/tsc.js -b
cd ../../apps/web   && bun ../../node_modules/typescript/lib/tsc.js --noEmit
cd ../server    && bun ../../node_modules/typescript/lib/tsc.js --noEmit
```

