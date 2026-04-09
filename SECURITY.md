(save to ops/SECURITY.md)
# Security

**Purpose**  
Guidelines for secrets, data handling, and secure development practices.

## Secrets management
- Never commit API keys or `.env` files.
- Use EAS secrets for build-time secrets.
- Use platform secret stores for production keys.

## Data handling
- Store only non-sensitive user data locally.
- Encrypt sensitive data at rest if required.
- Follow least-privilege principle for backend APIs.

## Authentication
- Use secure token storage and refresh flows.
- Invalidate tokens on sign-out.

## Vulnerability management
- Run dependency scans in CI.
- Patch critical vulnerabilities within 48 hours.

## Reporting security issues
- Create a private channel for security reports and assign a triage owner.
