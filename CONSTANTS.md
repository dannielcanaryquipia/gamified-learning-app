(save to constants/CONSTANTS.md)
# Constants

**Purpose**  
Centralized explanation of design tokens, layout constants, breakpoints, and scaling rules.

## Design tokens
- **Colors**: defined in `design/colors.ts`
  - `PRIMARY = #0B6FFF`
  - `ACCENT = #FFB84D`
  - `SUCCESS = #2ECC71`
- **Typography**: `design/typography.ts`
  - `H1 = 32`, `H2 = 24`, `BODY = 16`
- **Spacing scale**: 4, 8, 12, 16, 24, 32

## Layout constants
- `NAV_BAR_HEIGHT = 56`
- `SAFE_AREA_PADDING = 16`
- `CARD_RADIUS = 12`

## Breakpoints and scaling
- Mobile-first: base width 360
- Use `scale()` helper for responsive sizes
- Breakpoints: `SM = 360`, `MD = 768`, `LG = 1024`

## Where to change
- Update tokens in `design/` and regenerate `design/design-tokens.json` for agents.
