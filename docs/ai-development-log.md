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

## Actual problems and corrections

No implementation issues have been recorded yet. Findings will be added only after they actually occur, with evidence, correction and retest results.
