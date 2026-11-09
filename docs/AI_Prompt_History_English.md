# AI Prompt History: Portfolio Website

**Course:** SCU ISBA 2438

**Assignment:** Assignment 2 - Portfolio Website

**Student:** Mutian He

**AI assistant:** Viber

## Project Goal

Rebuild my existing personal website as an independent Next.js project while preserving its appearance, content, animations, and interactions. The original website, GitHub repository, and domain had to remain unchanged.

## Main Prompts and AI Actions

The prompts below are concise English summaries of the original Chinese messages, rather than verbatim quotations.

### 1. Analyze the Existing Website

**Prompt:** Review my original website and repository. Propose an independent Next.js project with at least four pages, dynamic project routes, and a Contact form with server-side validation. Complete the analysis first and wait for approval before making changes.

**AI actions:** Reviewed the website and source code, identified the existing pages and interactions, and proposed a project structure and implementation plan.

### 2. Build, Test, and Deploy

**Prompt:** Proceed with the approved plan. Match the original website as closely as possible, meet the assignment requirements, and record the development process. Complete testing, create a new GitHub repository, and deploy the new website to Vercel.

**AI actions:** Built the Next.js website, preserved the original content and design, added eight dynamic project detail pages and server-side Contact validation, tested the application, and published it independently.

### 3. Approve Contact Delivery

**User approval:** Allow the new website to reuse the existing Formspree contact destination.

**AI actions:** Configured delivery for the new project without changing the original website or form settings. Test submissions were accepted by Formspree.

## Real Problems and Improvements

These examples were recorded during actual draft review and testing.

| Problem | Improvement and Result |
| --- | --- |
| **Font integration:** Draft review found that the copied Poppins font setting was not connected to Next.js's font system. | Connected the font correctly and verified the rendered typography in the browser. |
| **Mobile navigation:** The expanded menu appeared behind the homepage content, preventing links from being clicked. | Adjusted the header's layering. Retesting confirmed that the menu displayed correctly and opened the selected page. |
| **Scrolling compatibility:** The copied smooth-scrolling styles triggered a Next.js warning during navigation. | Added the recommended scrolling setting. Later browser checks showed that the warning was resolved. |

## Verification and Final Result

- Four main pages and eight dynamic project detail pages were completed.
- The Contact form validates input on the server and supports real delivery.
- The production build, type checks, and eight automated tests passed.
- Sixty live HTTP checks and 24 responsive page checks passed.
- Four Git commits and supporting development records were retained.
- The original website, repository, and domain remained unchanged.

**Website:** https://portfolio-nextjs-mu-black.vercel.app

**Repository:** https://github.com/austin10231/portfolio-nextjs
