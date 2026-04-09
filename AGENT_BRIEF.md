# Agent Brief

## Purpose
Machine-readable instructions for AI agents and automation tools that will scaffold code, generate lesson drafts, and assist with content.

## Agents and responsibilities
- **Windsurf**: scaffold UI components and pages from `design/` tokens and `components/` catalog.
- **Antigravity**: generate TypeScript component stubs and unit tests.
- **NotebookLM**: ingest domain content (e.g., networking notes) and produce lesson drafts in Markdown.

## Input locations
- **Design tokens**: `design/design-tokens.json`
- **Component catalog**: `components/CATALOG.md`
- **Content source**: `content/` (Markdown lessons)
- **Active plan**: `docs/ARCHITECTURE.md`

## Expected outputs
- New component files under `components/` with Storybook stories.
- Lesson drafts saved to `content/drafts/` following `LESSON_TEMPLATE.md`.
- Unit test stubs in `tests/` for generated components.

## Constraints
- Follow TypeScript strict mode.
- Do not commit secrets or API keys.
- Respect `design/` tokens for spacing and colors.

## Example prompt for NotebookLM
- Input: raw course notes or URL to course material.
- Output: a lesson Markdown file with frontmatter matching `LESSON_TEMPLATE.md`, 300–600 words, 2–3 quiz questions.

## Where agents write
- Drafts: `content/drafts/`
- Generated components: `components/generated/`
- Tests: `tests/generated/`

## Contact
- Human reviewer: project owner (Danniel)
