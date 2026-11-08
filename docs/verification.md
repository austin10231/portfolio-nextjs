# Verification report

Date: 2026-11-07 (America/Los_Angeles). Scope: the assignment requirements supplied by the user.

## Local checks

| Check | Result |
| --- | --- |
| TypeScript strict check | Passed |
| Node.js 24.22.2 test run | 8 tests passed |
| Next.js 16.4.5 production build on Node 24 | Passed; eight generated project routes and dynamic Contact API |
| HTTP integration against development server | 60 checks passed |
| HTTP integration against production server | 60 checks passed |
| Original images/PDFs | All 14 exact Git blob hashes match |
| Projects / skills / translations | 8 projects, 24 skills, 134 keys in each language |
| Responsive DOM checks | 24 combinations: six pages × 320/390/768/1280px; no horizontal document overflow |
| Theme/language | English/light and Chinese/dark inspected; preferences survive reload; correct resume file selected |
| Navigation | Main routes, mobile menu, dynamic detail click and refresh verified |
| Experience panels | Click and ArrowLeft switching, single visible panel and matching hash verified |
| Server form feedback | Whitespace-only name/message rejected with visible English and Chinese field errors |
| Actual delivery | Authorized local QA submission returned HTTP 200 `{"ok":true,"message":"sent"}` after Formspree acceptance |

The original `my-profile` main commit was read again after implementation and remains `3ef6c8264a0efb6a8e42f752a34b3e2e4caf56db`. No write commands or remotes target that repository.

## Browser evidence

- `screenshots/home-desktop.jpg`
- `screenshots/home-mobile.jpg`
- `screenshots/mobile-menu-fixed.jpg`
- `screenshots/contact-server-validation.jpg`
- `screenshots/project-dynamic-route.jpg`

Responsive QA used browser viewport sizes rather than physical devices. Reduced-motion/coarse-pointer behavior was reviewed in the CSS and effect guards; OS accessibility preferences were not changed. Third-party project links retain their original destinations; their future availability is outside this deployment's control. Delivery acceptance was tested; the Outlook inbox was not independently inspected.

## Deployment verification

- Public production URL: https://portfolio-nextjs-mu-black.vercel.app
- New public repository: https://github.com/austin10231/portfolio-nextjs
- Vercel project: `portfolio-nextjs`, separate ID `prj_w4PCM7kWlON6PxUtwes3zIduYrc4`.
- GitHub default branch: `test-new-function`, following the local workspace push instructions. The local development branch tracks it.
- Vercel is connected only to the new repository. Production/Preview use the new project's server-only `CONTACT_FORM_ENDPOINT` variable.
- First production deployment reached Vercel `READY` and the public alias returned HTTP 200 without credentials or protection-bypass tokens.
- All **60 HTTP checks passed against the public production alias**, including eight detail routes, unknown-route 404s, all local assets, legacy redirects and direct server validation.
- A valid same-origin production POST returned **HTTP 200 with `ok: true`** after provider acceptance. Together with the local test, two clearly labeled QA messages were submitted to the owner-authorized existing channel.
- The original repository head was read again after deployment and is still `3ef6c8264a0efb6a8e42f752a34b3e2e4caf56db`.
- The new Vercel project's Node setting was explicitly aligned to 24.x, matching `package.json` and the tested local runtime.
- Public browser QA verified mobile-menu navigation, a dynamic project detail refresh and visible server-side Contact field errors. No production browser errors/warnings were recorded during these checks; the earlier smooth-scroll warning is resolved.
- Final screenshots were captured from the public deployment, with the page-entry animation allowed to finish before the homepage capture.
