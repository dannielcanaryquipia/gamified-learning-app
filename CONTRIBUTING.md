(save to docs/CONTRIBUTING.md)
# Contributing

**Purpose**  
Onboarding guide for contributors, PR process, and code standards.

## Getting started
1. Fork the repo and create a feature branch.
2. Run `npm install` and `npm start`.
3. Add tests for new features.

## Branching and commits
- Branch naming: `feature/<short-desc>`, `fix/<short-desc>`
- Commit messages: Conventional Commits (feat, fix, chore, docs)
- Rebase before merging.

## Pull request checklist
- [ ] Code builds locally
- [ ] Tests added/updated
- [ ] Lint passes
- [ ] Storybook story added for UI changes
- [ ] Update docs if behavior changed

## Code review
- Keep PRs small and focused.
- Reviewers: at least one frontend engineer and one product/design reviewer for UI changes.

## Onboarding new contributors
- Add to `CONTRIBUTORS.md` after first merged PR.
