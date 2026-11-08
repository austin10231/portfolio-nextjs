# Assignment 2 Part 1 - Submission Checklist

**Course:** SCU ISBA 2438

**Student:** Mutian He

**AI assistant:** OpenAI Codex

**Scope:** Requirements listed in the Part 1 review request.

## Pages and Functionality

- [x] Home: [`/`](https://portfolio-nextjs-mu-black.vercel.app/).
- [x] About Me: [`/about-me`](https://portfolio-nextjs-mu-black.vercel.app/about-me).
- [x] Projects: [`/projects`](https://portfolio-nextjs-mu-black.vercel.app/projects).
- [x] Server Contact Form: [`/contact-me-server-form`](https://portfolio-nextjs-mu-black.vercel.app/contact-me-server-form).
- [x] Eight dynamic project pages remain available, including [Maze Navigation](https://portfolio-nextjs-mu-black.vercel.app/projects/rl-maze-navigation) and [Multimodal Image Search](https://portfolio-nextjs-mu-black.vercel.app/projects/multimodal-image-search).
- [x] Existing design, biography, images, documents, animations, language/theme controls and compatibility pages are retained.

## Server Form and Private JSON

- [x] Name, email and message are validated on the server.
- [x] Validated submissions are saved as individual JSON records in private Vercel Blob storage before success is reported.
- [x] Local integration test retrieved actual JSON with owner credentials; anonymous access returned HTTP 403.
- [x] No submission listing/download endpoint or public JSON copy is exposed by the website.
- [x] Email notifications remain available. A notification failure does not lose a saved message.
- [ ] Production JSON persistence and privacy verified after redeployment.

## Verification and Publishing

- [x] Type check and production build passed.
- [x] All 12 automated tests passed.
- [x] All 75 local HTTP checks passed.
- [x] All 36 responsive page/viewport checks passed, including the tablet navigation fix.
- [ ] All 75 HTTP checks passed against the deployed website.
- [ ] Changes committed and pushed to the existing repository, then redeployed to Vercel.
- [x] Original website, original repository and original domain were not modified.

## Documentation to Submit

- [x] [AI_Prompt_History_English.md](AI_Prompt_History_English.md) - original prompt summaries and AI actions.
- [x] [AI_Issues_and_Fixes_English.md](AI_Issues_and_Fixes_English.md) - three real issues, fixes, results and evidence.
- [x] Project README and detailed development/verification records in the repository.
- [x] AI tool identified accurately as OpenAI Codex.

**Repository:** https://github.com/austin10231/portfolio-nextjs

**Website:** https://portfolio-nextjs-mu-black.vercel.app
