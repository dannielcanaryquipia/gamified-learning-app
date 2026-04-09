### Design System & Tokens

#### Purpose
Centralized explanation of design tokens, layout constants, breakpoints, and scaling rules to ensure consistency across the application.

#### Core Design Tokens
* **Colors** (defined in `design/colors.ts`):
    * PRIMARY: `#0B6FFF`
    * ACCENT: `#FFB84D`
    * SUCCESS: `#2ECC71`
* **Typography** (defined in `design/typography.ts`):
    * H1: 32px
    * H2: 24px
    * BODY: 16px
* **Spacing Scale**: 4, 8, 12, 16, 24, 32

#### Layout Constants
* **NAV_BAR_HEIGHT**: 56
* **SAFE_AREA_PADDING**: 16
* **CARD_RADIUS**: 12

#### Breakpoints and Scaling
* **Mobile-first approach**: Base width is 360.
* **Scaling**: Use the `scale()` helper for responsive sizes.
* **Breakpoints**:
    * SM: 360
    * MD: 768
    * LG: 1024

#### Implementation Rules
* **Strict Adherence**: All AI agents (Windsurf, Antigravity) and engineers must respect `design/` tokens for spacing and colors.
* **Updates**: Any changes to the design system should be updated in the `design/` directory and then regenerated into `design/design-tokens.json` for AI agent ingestion.
* **Accessibility**: Ensure touch targets are at least 44x44 dp and avoid color-only cues.
