(save to ops/RELEASES.md)

# Releases

**Purpose**  
Release process, versioning policy, and build steps.

## Versioning
- Semantic Versioning: `MAJOR.MINOR.PATCH`
- Use conventional commits to generate changelog.

## Release flow
1. Merge feature branches to `main`.
2. Run CI: tests, lint, build.
3. Create release candidate branch `rc/x.y.z`.
4. Run EAS build and smoke tests.
5. Tag release and publish to app stores via EAS.

## Build commands
- `eas build --platform ios`
- `eas build --platform android`

## Hotfixes
- Branch from `main` → `hotfix/x.y.z` → PR → merge → tag.

## Changelog
- Maintain `CHANGELOG.md` with human readable release notes.
