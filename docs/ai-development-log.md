# AI-assisted development log

Dates use America/Los_Angeles. Entries describe actual work, not hypothetical errors.

## 2026-11-07 — Analysis and authorization

**Main user prompt:** Recreate `mutianhe.com` and `austin10231/my-profile` as a fully independent Next.js portfolio for SCU ISBA 2438 Assignment 2; preserve appearance, content, animation and interactions; provide at least four pages, dynamic project routes, a Contact form with server validation, Git history, a new GitHub repository, Vercel deployment and truthful AI development evidence. Analyze first and wait for approval before writing anything.

**Read-only findings:** Four main pages (Home, Experience, Projects, Contact), eight project cards, two experience panels, an additional six-image Smart Parking gallery, bilingual content, theme persistence, translated resume links and multiple animations. Contact posts directly to Formspree. Final displayed translations override some HTML fallback text.

**User approval / second main prompt:** “确认采用以上方案，请开始第二阶段开发。” The user prioritized fidelity and authorized implementation, full testing, a new GitHub repository and an independent Vercel deployment. They explicitly required automatic recording of prompts, commits, decisions and actual fixes.

**Boundary:** All changes are confined to the new project directory. Original repository access uses GET requests only. No original CNAME, domain or deployment settings are copied or changed.

## 2026-11-07 — Project foundation

- Confirmed the current directory has no project files, commits or remotes.
- Confirmed GitHub CLI is signed in as `austin10231`.
- Queried the npm registry rather than assuming package versions: Next.js 16.4.5, React 19.3.1 and Zod 4.6.7.
- Created the independent package/configuration, README and this log before implementation.

## 2026-11-07 — Faithful React migration

- Migrated the original CSS and extracted the final 134 English and 134 Chinese translation values, eight project records and 24 skills.
- Copied all 14 image/document assets from pinned original commit `3ef6c82`; verified every asset against its original Git blob SHA-1. Copied Font Awesome 6.5.1 fonts/styles locally to preserve the original icon shapes.
- Added four main routes, eight generated project-detail routes, the UI gallery, legacy `.html` redirects, theme/language persistence, both resume variants and experience hash navigation.
- Reimplemented reveal, page entry, tilt, magnetic and stardust effects with route-owned cleanup and reduced-motion/touch behavior.
- Implemented the real request handler and six tests covering server validation, trimming, delivery boundaries, provider/network failure and malformed/oversized requests.
- First `typecheck`, all six tests and the first production build passed. Build output shows all eight `[slug]` pages and a dynamic `/api/contact` route.

## Actual problems and corrections

### 1. CSS font name did not match next/font's generated font family

- **Observed in draft code review:** The imported original `body` rule used the literal `"Poppins"`, while the Next.js layout registered the font through `next/font`'s `--font-poppins` variable. Merely importing the original CSS would therefore fall back to a different font.
- **Correction:** Connected the original font stack to `var(--font-poppins)` while retaining the fallback. This keeps the original weights and serves optimized font files from the new deployment.
- **Retest:** Production build passed; computed browser font and visual comparison are pending below.

### Additional environment findings (not fabricated AI implementation errors)

- Python's local CA configuration rejected HTTPS asset retrieval (`CERTIFICATE_VERIFY_FAILED`). Switched to the system `curl` trust store with certificate verification enabled, then verified downloaded asset hashes; no security checks were disabled.
- The initial test command emitted a Node module-type warning. Declared the project's actual ESM format with `"type": "module"`.
- Host Node is 26, while production targets Node 24. Installed a temporary Node 24 runner for matching-runtime verification; the initial host-runtime build already passed.
- Vercel CLI was logged out, and the browser required account login. A real device-auth URL was provided to the user while local development continued. Independent Contact delivery configuration is also pending; missing configuration returns 503 instead of a false sent message.
