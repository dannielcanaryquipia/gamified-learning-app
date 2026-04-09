(save to components/COMPONENTS.md)
# Components

**Purpose**  
Catalog of reusable UI components, usage rules, props contract, accessibility notes, and Storybook links.

## How to use this file
- Add a short entry for each component with props, variants, and example usage.
- Keep examples minimal and copy-paste ready.

## Component naming and structure
- **Naming**: PascalCase (ButtonPrimary, LessonCard, Avatar)
- **File layout**: `components/<ComponentName>/index.tsx`, `styles.ts`, `__tests__`, `stories.tsx`
- **Export**: Barrel export in `components/index.ts`

## Component contract template
**Component**: `ButtonPrimary`  
**Purpose**: Primary CTA used across flows.  
**Props**:
- `label: string` **required**
- `onPress: () => void` **required**
- `disabled?: boolean`
- `variant?: 'primary' | 'secondary'`
**Accessibility**:
- Provide `accessibilityLabel` when label is not descriptive.
- Ensure touch target >= 44x44 dp.

## Common components to implement first
- **ButtonPrimary**, **ButtonSecondary**
- **Card** (with header, body, footer slots)
- **Avatar** (sizes: small, medium, large)
- **LessonPlayer** (renders Markdown + quiz)
- **QuizQuestion** (supports multiple-choice, true/false)
- **XPBar** (animated progress)
- **LevelUpModal** (confetti animation optional)
- **Toast** and **Snackbar**
- **Icon** wrapper for consistent sizing and color tokens

## Storybook and visual tests
- Each component must include a Storybook story demonstrating variants.
- Add snapshot tests for critical visual states.
