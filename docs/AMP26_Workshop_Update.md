# AMP 26 public workshop update

## Scope
The default React entry is a three-lab Korean workshop. No quizzes, XP, completion gates, generated-result simulation, network save, upload, audio, installation or scheduled execution were added. Legacy App is preserved byte-for-byte as src/LegacyApp.jsx, available at #legacy. Its original promptStudio regression test imports LegacyApp. No legacy storage is migrated or cleared.

## Learning flow
- Pomelli: edit public/fictional brand, purpose, facts and aspect ratio; copy a campaign prompt; open the real service explicitly; record only actual output title/public URL and observations.
- Gemini Notebook: edit/copy a fictional source sheet; open the real service; add Copied text and ask a grounded question; record actual outputs.
- Harness: goal → non-sensitive sources → human/source-organizer/writer/designer roles → output → cadence and next-run memory. Preview and export Markdown/JSON plus a copy-ready prompt. This is a design file, not an installed autonomous agent.

## Evidence boundary
Supplied read-only inspection confirms entry/input UI only, not generation outcomes. Pomelli inspection was an existing-brand signed-in account; first-brand onboarding is unverified. Gemini Notebook labels are recorded as supplied. Internet, login, account eligibility and service availability are required. An unavailable service should lead to another lab or local harness design, never a fake success.

## Privacy and technical boundaries
Only public fictional exercise content was authored. Do not enter student/contact data or private links. State uses amp26-live-workshop-v1, schema allowlisting, bounded strings, version checking and safe parse. Blocked/quota storage falls back to current-page memory with a warning. Browser storage is not encrypted. Export before leaving; no automatic reset. External result anchors accept only http(s), reject embedded credentials, and use noopener noreferrer. JSX renders escaped text, never raw HTML. Markdown escapes HTML and link delimiters; JSON exports are data.

## Visual and accessible design
Scoped ivory/forest/antique-gold CSS, responsive layouts, tab arrow/Home/End navigation, visible focus, labels, skip link and status messages. SCREEN EFFECT 0–5 controls decorative glow only, not model reasoning or output quality. Brief particles occur only on explicit preview/download; reduced-motion disables animation. No sound. Optional original licensed art is loaded from public/workshop/forest.webp, mast.webp, thread.webp. Missing art falls back to CSS backgrounds and hidden broken-image elements.

## Verification / deployment
Scoped model and UI tests are in src/workshop/*.test.*; legacy prompt regression remains in src/App.promptStudio.test.jsx. No package/dependency changes or network installation. Parent must run installed Vitest/build/lint and desktop/mobile visual QA before publication. No commit, push, deploy or real-service generation was performed by this change. Existing legacy/global CSS and bundled public assets were not changed.

### Validation observed in isolated extraction
Vitest attempt failed with MODULE_NOT_FOUND for node_modules/vitest/vitest.mjs; node_modules was empty. No installation attempted by this worker. Ten pure-model runtime checks passed in the REPL (defaults, malformed/blocked storage, version fallback, unsafe/credential/safe URLs, non-autonomous design, HTML escaping, allowlist). React tests, build, lint and visual/browser QA remain unrun pending dependencies. Parent reports cached-only dependency installation blocked by missing cached tarball. Parent supplied the three original workshop illustrations separately.


## Parent review and verified status

- Corrected the workshop return anchor and separated field labels from hints.
- Improved inactive-tab and footer contrast after axe-core browser checks.
- Preserved original App byte-for-byte as LegacyApp against base 541eac4.
- Updated six legacy E2E navigation targets to /#legacy; added four workshop E2E tests.
- Added dependency-free scripts/workshop-smoke.mjs: all 17 checks passed.
- Added a read-only GitHub validation workflow, not yet pushed or run.
- Native Vite build, full Vitest, lint, typecheck and Playwright remain blocked by unavailable offline dependencies.
- Browser component preview used locked React 19.2.4 and original global styles. This is not a deployed production build.
- Detailed observed scope: AMP26_Verification.json.
