(save to tests/TESTING.md)

# Testing

**Purpose**  
Testing strategy, commands, and CI integration.

## Test types
- **Unit tests**: Jest + React Native Testing Library
- **Component visual tests**: Storybook snapshots
- **Integration tests**: Jest + mocked services
- **E2E tests**: Detox or Playwright for mobile flows

## Commands
- `npm run test` — run unit tests
- `npm run test:watch` — watch mode
- `npm run storybook` — run Storybook locally
- `npm run e2e` — run E2E suite (CI only)

## CI
- Run unit tests and lint on PRs.
- Run E2E on main branch before release.

## Test coverage targets
- **Critical modules**: 90% (hooks, services)
- **UI components**: snapshot coverage for core components

## Mocking
- Use `msw` for API mocking in integration tests.
- Mock AsyncStorage for persistence tests.

## Flaky test handling
- Mark flaky tests with `@flaky` and track in `tests/FLAKY.md`.

