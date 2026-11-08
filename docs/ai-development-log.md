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
- **Retest:** Production build passed. Browser computed font is `Poppins, "Poppins Fallback", Poppins, sans-serif`; desktop 1280×720 and mobile 390×844 comparisons match the original typography and layout.

### 2. Mobile menu was painted behind the main page

- **Reproduction:** At 390×844, expand the hamburger menu and click EXPERIENCE. The navigation timed out without changing the URL. The screenshot showed the page heading/avatar covering menu items.
- **Cause:** The first migration retained the original equal `z-index: 1` on header and main. The menu's own z-index could not escape the header's stacking context.
- **Correction:** Raised the shared `.header` stacking level to 10; retained the same menu layout and animation. Closed menus are also hidden from keyboard/accessibility navigation.
- **Retest:** The menu overlays the page correctly; clicking EXPERIENCE reaches `/experience`, closes the menu and displays both experience tabs. No horizontal overflow at 390px. Research click changes the URL to `#research`; ArrowLeft returns to `#industry` with only the intended panel visible.

### 3. Original smooth-scrolling CSS needed a Next.js 16 adaptation

- **Observed:** Browser console emitted `Detected scroll-behavior: smooth ... add data-scroll-behavior="smooth"` during client navigation. The first migration copied the CSS without the matching Next.js root attribute.
- **Correction:** Read the installed Next.js 16 upgrade guide and added `data-scroll-behavior="smooth"` to the root HTML element. This preserves smooth in-page anchors while allowing route navigation to reset scrolling correctly.
- **Retest:** Browser reload/navigation and console review are included in the final verification report.

### Browser verification completed so far

- English/light desktop homepage: original layout and fonts; all three home images loaded; no horizontal overflow.
- Chinese/dark homepage: all visible text translates, correct Chinese resume URL, preferences survive reload.
- Client navigation and dynamic project detail: correct localized content, detail refresh works, only one stardust layer remains after navigation.
- Contact: whitespace-only name/message pass browser length checks but receive real server field errors, displayed in Chinese with accessible field associations. No message was sent by this validation test.
- Preserved the original UI gallery and added a small link below the project archive so it is discoverable without changing the eight original cards.

### Additional environment findings (not fabricated AI implementation errors)

- Python's local CA configuration rejected HTTPS asset retrieval (`CERTIFICATE_VERIFY_FAILED`). Switched to the system `curl` trust store with certificate verification enabled, then verified downloaded asset hashes; no security checks were disabled.
- The initial test command emitted a Node module-type warning. Declared the project's actual ESM format with `"type": "module"`.
- Host Node is 26, while production targets Node 24. Installed a temporary Node 24 runner for matching-runtime verification; the initial host-runtime build already passed.
- Vercel CLI was logged out, and the browser required account login. A real device-auth URL was provided to the user while local development continued. Independent Contact delivery configuration is also pending; missing configuration returns 503 instead of a false sent message.

## 2026-11-07 — Deployment authentication and delivery authorization

The user answered “已完成 Vercel 登录” and “允许新站复用原表单收件地址”. The new project will therefore keep its own server environment variable pointing to the existing public Formspree delivery endpoint. This does not change the original site's code, form configuration, domain or deployment. Real delivery verification can now proceed.

- The first CLI device-auth process had already ended before authorization persisted. A fresh code was issued; the user completed it and the CLI explicitly returned “Congratulations! You are now signed in.” No password or account token was added to the repository.
- An authorized local QA message sent through the new server Route Handler was accepted by Formspree; the endpoint returned HTTP 200 with `ok: true`. This proves the delivery path is active, not merely a simulated success.
- Matching-runtime verification completed on Node 24.22.2: 8 tests passed, production build passed, and all 60 HTTP checks passed against the production server.
- Browser responsive checks completed for six pages at 320, 390, 768 and 1280px: 24 combinations with no horizontal document overflow.
- Saved real browser screenshots for the desktop/mobile homepages, fixed mobile menu and server validation feedback. Corrected the first desktop screenshot, which had been captured during the preserved page-entry fade, by recapturing after the animation finished.
