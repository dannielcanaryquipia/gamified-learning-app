# Lesson Markdown Template

Use this canonical frontmatter and structure for every lesson file in `content/`.

---
title: "Lesson Title"
topicId: "topic-slug"
lessonId: "lesson-001"
xp: 50
estimatedMinutes: 10
locked: false
thumbnail: "/assets/content/lesson-001-thumb.png"
tags: ["networking", "basics"]
quiz:
  quizId: "quiz-lesson-001"
  passingScore: 70
  questions:
    - id: "q1"
      type: "multiple-choice"
      prompt: "Which layer handles routing?"
      choices:
        - id: "a"
          text: "Transport"
        - id: "b"
          text: "Network"
        - id: "c"
          text: "Application"
      answer: "b"
---

# Heading 1
Intro paragraph. Keep content concise and scannable.

## Key Concepts
- Bullet list of concepts

## Example
```js
// code block example
console.log("Example");

Interactive Check
[ ] Quick reflection or micro-challenge

Quiz
The quiz is defined in frontmatter. The lesson player will render the quiz UI from that data.

Author notes
Author: Name
Review: Date


---

### DESIGN.md
```markdown
# Design Guidelines

## Purpose
Centralized design rules, tokens, and component usage to ensure consistent UI across the app.

## Design tokens
- **Colors**
  - Primary: `#0B6FFF`
  - Accent: `#FFB84D`
  - Success: `#2ECC71`
  - Background: `#FFFFFF`
  - Surface: `#F6F8FA`
  - Text Primary: `#0F1724`
- **Typography**
  - Heading: Inter 600
  - Body: Inter 400
  - Scale: 16, 18, 20, 24, 32
- **Spacing**
  - Scale: 4, 8, 12, 16, 24, 32

## Component rules
- **Button**
  - Primary: filled with Primary color, 16px radius
  - Secondary: outline with Primary border
- **Card**
  - Elevation: subtle shadow, 12px padding
- **Avatar**
  - Sizes: 32, 48, 72

## Motion and gamification cues
- Use micro-animations for XP gain (small confetti burst) and level-up modal.
- Keep animations short (200–400ms) and optional for accessibility.

## Assets and exports
- Place exported SVGs and PNGs in `design/assets/`.
- Provide Figma/Stitch links and component tokens for engineers.

## Accessibility
- Maintain contrast ratio >= 4.5:1 for body text.
- Provide reduced-motion option in settings.

## Design handoff
- Link to Stitch project and include component variants.
- Provide Storybook stories for each component in `components/`.


