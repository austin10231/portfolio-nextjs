# Mutian He — Next.js Portfolio

Independent recreation of [Mutian He's existing portfolio](https://mutianhe.com/index.html) for **SCU ISBA 2438 Assignment 2: Portfolio Website**. It preserves the original layout, biography, bilingual content, blue palette, Poppins typography, photos, documents, theme switcher and motion design.

The original `austin10231/my-profile` repository, `mutianhe.com`, DNS and deployment are unchanged. This repository and its Vercel deployment are separate.

## Stack and features

- Next.js 16.4.5 App Router, React 19.3.1, TypeScript and CSS.
- Four main pages plus the retained Smart Parking UI gallery.
- Eight data-driven `/projects/[slug]` detail pages, generated using `generateStaticParams`; unknown slugs return 404.
- Real Contact form with Zod validation in the server Route Handler at `/api/contact`.
- English/Chinese and light/dark preferences persisted in browser storage; language-aware resume downloads.
- Original reveal, page-entry, card-tilt, magnetic-button and stardust effects with listener cleanup and reduced-motion/touch handling.
- All original images and PDFs copied into the new project and verified against their source Git hashes. No original-domain asset dependency.
- Old `.html` paths redirect locally to the new routes.

## Install and run

Requires **Node.js 24** and npm.

```sh
npm ci
cp .env.example .env.local
# Set CONTACT_FORM_ENDPOINT in .env.local for real delivery.
npm run dev
```

Open `http://localhost:3000`.

```sh
npm run build
npm start
```

## Contact configuration and behavior

Set `CONTACT_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID` in the new project's server environment. The owner explicitly authorized reusing their existing Formspree delivery endpoint; no original form settings were changed. The value is never exposed through a `NEXT_PUBLIC_` variable.

The server trims and validates name (2–80 characters), email (valid format, at most 254 characters) and message (10–5,000 characters). It also rejects honeypot submissions, malformed JSON, cross-origin browser requests and oversized request bodies. Invalid requests receive HTTP 400 with field errors. Provider errors return 502; missing configuration returns 503. Success is shown only after the delivery provider accepts the message. A provider acceptance is not an independently verified inbox receipt.

## Routes

| Route | Content |
| --- | --- |
| `/` | Introduction, education, experience/project gateways, 24 skills, resumes and social links |
| `/experience` | AWS/RiskLens and SCU research; `#industry` and `#research` select panels |
| `/projects` | All eight original project cards and gallery link |
| `/projects/[slug]` | Unique detail page with original description, stack and external links |
| `/contact` | Name/email/message form and direct email alternative |
| `/ui-design` | Six original Smart Parking interface images |
| `/api/contact` | POST-only server validation and delivery |

## Structure

```text
src/app/          App Router pages, metadata, redirects and Contact Route Handler
src/components/  Shared shell, localization, project cards, tabs, form and effects
src/data/        Original bilingual text, project data and skills
src/lib/         Server validation/delivery and project lookup
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

## Deploy to Vercel

Import **this new repository only** as a new Next.js Vercel project. Keep Node.js 24, set `CONTACT_FORM_ENDPOINT` for Production/Preview as needed, and deploy. Do not configure a static export: `/api/contact` requires the server runtime. Use the new project's generated Vercel address; do not attach the original custom domain.

## Assignment evidence

- [AI prompts, actual shortcomings and fixes](docs/ai-development-log.md)
- [Technical and design decisions](docs/decisions.md)
- [Verification report](docs/verification.md)
- [Video demonstration checklist](docs/demo-checklist.md)
- [Submission checklist](docs/submission-checklist.md)
- [Screenshots](docs/screenshots)

## Source and licenses

Reference: [austin10231/my-profile](https://github.com/austin10231/my-profile), pinned at `3ef6c8264a0efb6a8e42f752a34b3e2e4caf56db`. All biography and project claims come from that portfolio; no personal history or project results were invented. The original template's Raj Shekhar MIT attribution is retained in [LICENSE](LICENSE). Font Awesome 6.5.1 retains its [upstream license](public/vendor/fontawesome/LICENSE.txt). Poppins is self-hosted by Next.js's font integration.
