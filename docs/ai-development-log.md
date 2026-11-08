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
- **Retest:** Public browser navigation and reload completed with no production browser errors/warnings; the earlier smooth-scroll warning is resolved.

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
- At the initial authentication check, Vercel CLI was logged out and the browser required account login. A real device-auth URL was provided while local development continued. Delivery configuration was then pending; missing configuration correctly returned 503 instead of a false sent message. These dependencies were subsequently resolved below.

## 2026-11-07 — Deployment authentication and delivery authorization

The user answered “已完成 Vercel 登录” and “允许新站复用原表单收件地址”. The new project will therefore keep its own server environment variable pointing to the existing public Formspree delivery endpoint. This does not change the original site's code, form configuration, domain or deployment. Real delivery verification can now proceed.

- The first CLI device-auth process had already ended before authorization persisted. A fresh code was issued; the user completed it and the CLI explicitly returned “Congratulations! You are now signed in.” No password or account token was added to the repository.
- An authorized local QA message sent through the new server Route Handler was accepted by Formspree; the endpoint returned HTTP 200 with `ok: true`. This proves the delivery path is active, not merely a simulated success.
- Matching-runtime verification completed on Node 24.22.2: 8 tests passed, production build passed, and all 60 HTTP checks passed against the production server.
- Browser responsive checks completed for six pages at 320, 390, 768 and 1280px: 24 combinations with no horizontal document overflow.
- Saved real browser screenshots for the desktop/mobile homepages, fixed mobile menu and server validation feedback. Corrected the first desktop screenshot, which had been captured during the preserved page-entry fade, by recapturing after the animation finished.

## 2026-11-07 — Independent GitHub and Vercel publication

- Created the new public repository `austin10231/portfolio-nextjs`; only its URL is configured as `origin`.
- Pushed development commits to `test-new-function`, as required by the local workspace's push instructions, and made that the new repository's default branch.
- Confirmed the Vercel team contained only an unrelated existing project before creation; created a separate `portfolio-nextjs` project and connected it to the new GitHub repository. No existing project settings were changed.
- Stored `CONTACT_FORM_ENDPOINT` as a new project Secret for Production and Preview through stdin. `.env.local`, Vercel login/OIDC credentials and `.vercel` state are excluded from Git and source upload.
- First deployment reached READY at https://portfolio-nextjs-mu-black.vercel.app. The public alias passed all 60 HTTP integration checks without authentication.
- A same-origin valid POST to the live Contact endpoint returned HTTP 200 with `ok: true` after Formspree acceptance. There were two clearly labeled QA messages in total: one local, one deployed.
- Read the original repository head again after deployment; it remains `3ef6c8264a0efb6a8e42f752a34b3e2e4caf56db`.
- Aligned the new project's Vercel Node setting to 24.x to match the package engine and local test runtime.

## Commit milestones

1. `470c164` — independent project foundation and original user brief/log.
2. `5014f3d` — faithful React migration, dynamic routes and server-validated Contact implementation.
3. `e7e1651` — actual mobile navigation/scroll integration fixes, content tests, HTTP checks, evidence and assignment documentation.
4. `docs: record production deployment and assignment evidence` — live URLs, post-deployment checks, final public screenshots and submission materials.

## 2026-11-07 — Part 1 requirements review

**New user prompt:** Review the existing assignment, ensure `/`, `/about-me`, `/projects` and `/contact-me-server-form` exist, retain dynamic projects, save form submissions as private JSON that works on Vercel, prepare a separate concise English issues-and-fixes file, verify, commit/push and redeploy. Keep the original site unchanged and accurately identify Codex as the AI tool.

**Observed gaps:** Before changes, the two required new URLs returned HTTP 404. The existing Contact handler validated and emailed messages but did not persist JSON. The earlier brief allowed other page names and did not specify JSON persistence; this review applies the newly clarified Part 1 requirements.

**Changes and evidence so far:**
- Added real required routes using shared existing biography/form components and linked them in navigation. Kept all eight dynamic project routes and compatibility pages.
- Created a private Vercel Blob store connected only to `portfolio-nextjs`. Added server-only JSON writes with separate UUID records, no public read/list API and no temporary-file fallback.
- Changed the request flow to validate, persist, then notify. Storage failure cannot produce success; notification failure preserves the saved record and displays a truthful saved status.
- Twelve automated tests, strict type checking and the production build passed. All 75 expanded local HTTP checks passed.
- A real synthetic submission was read back as JSON with owner credentials. Anonymous Blob access returned 403; public copies were absent. Email notification also succeeded.
- The first responsive sweep found that the added navigation item overlapped the logo at 640px. Added compact navigation spacing/type only for 601-900px, then rebuilt for retesting.
- Located the user-moved prompt history at `Desktop/isba2438/assignment 2/AI_Prompt_History_English.md`. Preserved it and created `AI_Issues_and_Fixes_English.md` beside it, with matching copies in `docs/` and links to actual historical commits and verification evidence.
- Rechecked 36 page/viewport combinations after the tablet navigation correction; all passed. Mobile navigation to About Me, saved Chinese/dark preferences, translated resume links and real server field errors also passed.
