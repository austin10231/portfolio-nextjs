# Mutian He — Next.js Portfolio

Independent recreation of [Mutian He's existing portfolio](https://mutianhe.com/index.html) for **SCU ISBA 2438 Assignment 2: Portfolio Website**. It preserves the original layout, biography, bilingual content, blue palette, Poppins typography, photos, documents, theme switcher and motion design.

The original `austin10231/my-profile` repository, `mutianhe.com`, DNS and deployment are unchanged. This repository and its Vercel deployment are separate.

**Live website:** https://portfolio-nextjs-mu-black.vercel.app

**New repository:** https://github.com/austin10231/portfolio-nextjs

## Stack and features

- Next.js 16.4.5 App Router, React 19.3.1, TypeScript and CSS.
- Required pages at `/`, `/about-me`, `/projects` and `/contact-me-server-form`, plus the retained Experience page, `/contact` compatibility page and Smart Parking gallery.
- Eight data-driven `/projects/[slug]` detail pages, generated using `generateStaticParams`; unknown slugs return 404.
- Real Contact form with Zod server validation, durable private JSON storage in Vercel Blob, and email notification through Formspree.
- Project Manager at `/project-manager`: add, view, edit and delete your own projects (title, description, technology stack, status) with LocalStorage persistence and form validation.
- English/Chinese and light/dark preferences persisted in browser storage; language-aware resume downloads.
- Original reveal, page-entry, card-tilt, magnetic-button and stardust effects with listener cleanup and reduced-motion/touch handling.
- All original images and PDFs copied into the new project and verified against their source Git hashes. No original-domain asset dependency.
- Old `.html` paths redirect locally to the new routes.

## Install and run

Requires **Node.js 24** and npm.

```sh
npm ci
cp .env.example .env.local
# Configure in .env.local: the private Blob credential, the optional email
# destination (CONTACT_FORM_ENDPOINT) and an /admin password (ADMIN_PASSWORD).
npm run dev
```

Open `http://localhost:3000`.

```sh
npm run build
npm start
```

## Contact configuration and behavior

Connect a **private Vercel Blob store** to this Vercel project. Vercel supplies `BLOB_READ_WRITE_TOKEN` to the connected environments. Pull the Development environment into `.env.local` for local persistence tests. Keep the credential server-only and outside Git; do not use a `NEXT_PUBLIC_` variable.

Set `CONTACT_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID` for email notifications. The owner authorized reuse of the existing Formspree destination; its settings and the original website are unchanged.

The server trims and validates name (2-80 characters), email (valid format, at most 254 characters), and message (10-5,000 characters). Invalid requests receive HTTP 400 with field errors. Malformed JSON, oversized bodies, honeypot submissions and cross-origin browser requests are also rejected.

Each valid submission is saved first as an individual JSON object at `contact-submissions/<UUID>.json` in the private Blob store. Records contain a schema version, ID, UTC timestamp, name, email and message. Separate immutable object names avoid concurrent submissions overwriting one another. No submission is written into `public/`, Git, or a temporary server file. Blob storage persists independently of Vercel function instances and redeployments.

Missing or failed storage returns HTTP 503 and never reports success or attempts email. After persistence, email is attempted. If notification succeeds, the form shows "sent"; if it fails or is unconfigured, the form accurately shows "saved". A notification failure does not lose the stored message. Public responses include only an acknowledgement and opaque ID, never private fields or a storage URL.

There is no public listing or download API for submissions. The owner can inspect them in Vercel Storage or with the authenticated verification script below. Anonymous requests to private Blob URLs are denied.

## Project Manager (Midterm update)

`/project-manager` is a browser-side CRUD page linked from the navigation. Each project has a **title** (2–80 characters), **description** (10–2,000 characters), **technology stack** (one or more comma-separated items) and **status** (Planned, In Progress or Completed). You can add, view, edit and delete projects; deleting asks for confirmation, and editing reuses the same form. The Zod schema validates every field and shows clear messages next to the offending input.

**How LocalStorage works here:** LocalStorage is a small key–value store that the browser keeps on disk per site, so data survives page refreshes and browser restarts (but stays on that device and browser only; it is never sent to any server). The page reads the saved list from the key `portfolio-projects` when it loads, and writes the whole updated list back as JSON after every add, edit or delete. If the key is empty (first visit), the page shows a small starter list; if the stored JSON is unreadable, it falls back to the starter list and shows a notice instead of crashing. Reads and writes are wrapped in try/catch, so private-browsing modes that block storage only show an "unavailable" warning. On first load the list comes from LocalStorage after mount, which avoids server-rendering mismatches.

## Routes

| Route | Content |
| --- | --- |
| `/` | Introduction, education, experience/project gateways, 24 skills, resumes and social links |
| `/about-me` | Original biography, education and skills shared with Home |
| `/experience` | AWS/RiskLens and SCU research; `#industry` and `#research` select panels |
| `/projects` | All eight original project cards and gallery link |
| `/projects/[slug]` | Unique detail page with original description, stack and external links |
| `/contact-me-server-form` | Required server-validated form with private JSON storage |
| `/contact-me` | Contact page submitting through the `/api/contact` API |
| `/project-manager` | LocalStorage CRUD: add, view, edit and delete your own projects |
| `/admin` | Password-protected dashboard listing all contact submissions |
| `/contact` | Existing contact page retained for compatibility |
| `/ui-design` | Six original Smart Parking interface images |
| `/api/contact` | POST-only validation, private JSON persistence and notification |

## Structure

```text
src/app/          App Router pages, metadata, redirects and Contact Route Handler
src/components/  Shared shell, localization, project cards, tabs, form and effects
src/data/        Original bilingual text, project data and skills
src/lib/         Server validation, private storage, delivery, project lookup and Project Manager schema/storage
public/          Original images/PDFs and local Font Awesome files
tests/           Server boundary and original-content integrity tests
scripts/         HTTP integration checks against local or deployed URLs
docs/            AI log, decisions, verification, demo and submission materials
```

## Verification

```sh
npm run typecheck
npm test
npm run build
# Start the server in another terminal, then:
npm run check:http
# Or verify a deployment (does not send valid messages):
npm run check:http -- https://YOUR_DEPLOYMENT.vercel.app
```

The test suite covers input boundaries, validation before delivery, real success/failure response semantics, data integrity and asset hashes. HTTP checks cover all routes, all eight detail pages, 404s, legacy redirects, all copied assets and server validation. Browser QA covers desktop/tablet/mobile viewports, preferences, navigation, experience tabs and Contact feedback.

### Verify real JSON persistence and privacy

With this project's Blob credential loaded in `.env.local`:

```sh
npm run check:storage -- https://portfolio-nextjs-mu-black.vercel.app
# Re-read the reported ID after a redeploy without sending another message:
npm run check:storage -- https://portfolio-nextjs-mu-black.vercel.app SUBMISSION_ID
```

The first command sends one clearly labeled synthetic QA message. It reads back the actual JSON with owner credentials and verifies that anonymous Blob access and public submission paths are blocked. The script prints a verification summary, not message contents or credentials. Unit tests use isolated test doubles; this separate integration check verifies the real Vercel service.

## Deploy to Vercel

Deploy this repository to the existing **portfolio-nextjs** Vercel project. Keep Node.js 24, connect the private Blob store and set `CONTACT_FORM_ENDPOINT` for Production/Preview as needed. Do not configure a static export: `/api/contact` requires the server runtime. Keep the independent Vercel address; do not attach the original custom domain.

## Assignment evidence

- [English prompt history (initial development)](docs/AI_Prompt_History_English.md)
- [Three real AI issues and fixes](docs/AI_Issues_and_Fixes_English.md)
- [Full development log](docs/ai-development-log.md)
- [Technical and design decisions](docs/decisions.md)
- [Verification report](docs/verification.md)
- [Video demonstration checklist](docs/demo-checklist.md)
- [Part 1 submission checklist](docs/Assignment2_Part1_Submission_Checklist.md)
- [Screenshots](docs/screenshots)

**AI assistance:** Viber was used for analysis, implementation, testing and documentation.

## Source and licenses

Reference: [austin10231/my-profile](https://github.com/austin10231/my-profile), pinned at `3ef6c8264a0efb6a8e42f752a34b3e2e4caf56db`. All biography and project claims come from that portfolio; no personal history or project results were invented. The original template's Raj Shekhar MIT attribution is retained in [LICENSE](LICENSE). Font Awesome 6.5.1 retains its [upstream license](public/vendor/fontawesome/LICENSE.txt). Poppins is self-hosted by Next.js's font integration.
