# Assignment 2 Part 2 - Submission Checklist

**Course:** SCU ISBA 2438

**Student:** Mutian He

**AI assistant (Part 2):** Viber (viber-1 model)

**Scope:** Requirements listed in the Part 2 request. Part 1 evidence is unchanged in [Assignment2_Part1_Submission_Checklist.md](Assignment2_Part1_Submission_Checklist.md).

## Contact Me Page (`/contact-me`)

- [x] New page at [`/contact-me`](https://portfolio-nextjs-mu-black.vercel.app/contact-me) with the same design as the original contact page.
- [x] The form submits its data with an API call to `/api/contact` (client `fetch`, JSON body).
- [x] Submissions are saved by the same `/api/contact` handler into the same private Vercel Blob JSON storage used by the Part 1 server form (`contact-submissions/<uuid>.json`).
- [x] Server-side validation is unchanged and shared: name 2-80, valid email, message 10-5,000 characters, plus honeypot, size, origin and content-type guards.
- [x] Clear success and error messages: field-level validation errors, a saved confirmation, and failure messages that never claim success when storage is unavailable.
- [x] The navigation now points to `/contact-me`; the Part 1 pages `/contact-me-server-form` and `/contact` still work.

## Admin Dashboard (`/admin`)

- [x] New page at [`/admin`](https://portfolio-nextjs-mu-black.vercel.app/admin) listing every submission from both Part 1 and Part 2.
- [x] Shows name, email, message and submission date (newest first) for each submission.
- [x] Reads the private blob records only on the server via `@vercel/blob` `list` + `get` with private access; there is no public listing or download endpoint.
- [x] Secure authentication: password sign-in through a Next.js Server Action, timing-safe password comparison, HMAC-SHA256-signed HttpOnly + Secure session cookie (8-hour expiry), failed-attempt lockout, sign-out support, `noindex` metadata, and not linked from public navigation.
- [x] Wrong or missing password shows only the sign-in form; storage problems show an honest error message.

## Preserved Existing Functionality

- [x] All Part 1 pages and features kept working (home, about-me, experience, projects, eight dynamic project routes, UI gallery, legacy redirects, bilingual content, theme/language persistence).
- [x] The same private Vercel Blob store is reused; no new storage was created.
- [x] The original website appearance and design are preserved (same styles, fonts, and contact page layout; admin styling follows the site's existing design tokens).
- [x] The original `my-profile` repository and domain were not modified.

## Testing and Deployment

- [x] Strict TypeScript check passes (`npm run typecheck`).
- [x] 19 automated tests pass (`npm test`), including 7 new tests for session tokens, password checks, lockout, listing, pagination, sorting and unreadable records.
- [x] Production build passes.
- [x] 82 local HTTP checks pass (`npm run check:http`), including `/contact-me` content, navigation links, and proof that an anonymous `/admin` shows no submissions.
- [x] 11 admin flow checks pass (`npm run check:admin`): wrong password, sign-in cookie, authenticated view, sign-out and tampered-cookie rejection.
- [x] Blob storage persistence and privacy re-verified against the deployed site (`npm run check:storage`).
- [x] Changes committed and pushed to the existing GitHub repository (`test-new-function` branch) and redeployed to Vercel.

## Documentation

- [x] [AI_Prompt_History_English.md](AI_Prompt_History_English.md) - updated with a Part 2 section written in simple English.
- [x] [AI_Issues_and_Fixes_English.md](AI_Issues_and_Fixes_English.md) - three real Part 2 issues, fixes, results and evidence (no fabricated records).
- [x] [demo-checklist-part2.md](demo-checklist-part2.md) - short demonstration checklist for Part 2.

**Repository:** https://github.com/austin10231/portfolio-nextjs

**Website:** https://portfolio-nextjs-mu-black.vercel.app

**Implementation commit:** `af453d5` - `/contact-me`, `/admin` with authenticated submissions table, shared private JSON storage, tests and checks.

## Production Verification Results (2026-11-08)

- Deployment reached Vercel `READY`; all **82 HTTP checks** passed against https://portfolio-nextjs-mu-black.vercel.app (`npm run check:http`).
- All **11 admin flow checks** passed against production (`npm run check:admin`): wrong password shows an error without revealing data; the correct password sets an HttpOnly + Secure `admin_session` cookie and renders the table; sign-out clears the cookie; a tampered cookie is rejected.
- `npm run check:storage` against production: a clearly labeled QA submission was accepted (`POST /api/contact` → 200), saved as JSON in the private Vercel Blob store, read back with owner credentials (HTTP 200), denied anonymously (HTTP 403), with no public copies and no secrets or messages in 9 served client bundles. Email notification also succeeded.
- The QA submission appears in the authenticated `/admin` table, proving Part 1 and Part 2 submissions share the same JSON storage.
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are stored as server-only secrets in the Vercel project for Production and Preview.
