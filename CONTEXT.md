# AMP Tacit Knowledge

This document defines the project language agents should use when working on the AMP tacit knowledge app. Read it after `CODEX-DIRECTIVE.md` and before changing product behavior.

## Language

**Tacit knowledge**:
Experience-shaped expert judgment that users often describe as "I just know" or "I just do it." The app's job is to help Korean academy operators make this knowledge visible, shareable, and reusable.
Avoid: vague "know-how" when a more specific term exists.

**Activity**:
An interactive unit that extracts or transforms tacit knowledge. Existing activities must be preserved and extended rather than replaced.
Avoid: page, mini app.

**Original activities**:
The six activities inherited from `tacit-knowledge-workshop.jsx`: timeline, autopilot detector, crisis replay, transfer to a new teacher, SECI transformation, and gallery work. These are protected product surface.

**Cross-domain activity**:
A newer activity adapted from nursing, military decision-making, cooking apprenticeship, knowledge mapping, or cognitive task analysis.

**XP**:
The local progress score awarded for meaningful activity completion, quiz performance, combo behavior, and other game actions. XP is persisted client-side only.

**Level**:
A named user progression tier derived from XP. Level changes should feel like progress feedback, not a replacement for the learning goal.

**Badge**:
A symbolic achievement unlocked by completing notable behaviors or milestones. Badges should reward discovered tacit knowledge patterns, not empty clicking.

**Combo**:
A short-lived streak reward for consecutive completions or correct answers. Combo state should not make the app fragile or punish reflective free-writing.

**Final report**:
The synthesized output shown after enough activities are completed. It includes the tacit knowledge profile, radar-style domain summary, SECI mapping, and AI prompt pack.

**AI prompt pack**:
Client-generated prompts derived from user answers. It must not call an external AI API.
The AMP runtime does not collect provider API keys, select hosted models, or execute prompts. Users may copy locally generated prompts into an external AI tool.
Tutorial content may demonstrate an external API, but tutorial model IDs must be reviewed against the provider's official lifecycle documentation before release.

**SECI mapping**:
The app's interpretation of Socialization, Externalization, Combination, and Internalization. Use it to explain how raw experience becomes shareable knowledge.

**Local game state**:
The persisted `localStorage` state that stores XP, level, badges, completed activities, answers, timing, and report inputs.

## Relationships

- An **Activity** may award **XP**, unlock **Badges**, and contribute answers to the **Final report**.
- The **Original activities** are the baseline journey; **Cross-domain activities** extend the journey.
- The **AI prompt pack** is generated from user-written answers and belongs inside the **Final report**.
- **Local game state** is the only persistence layer.

## Rules

- Use Korean for UI copy and user-facing content.
- Use English for code identifiers, file names, and test names unless existing code requires otherwise.
- Preserve the original six activities when adding features.
- Do not introduce external APIs, backend storage, or TailwindCSS.
- Prefer behavior language over implementation language in tests and issue descriptions.

## Flagged Ambiguities

- "AI analysis" means local heuristic synthesis in this project unless the user explicitly changes the product constraint. It does not mean calling ChatGPT, Claude, or any external model.
- "Gallery" currently means local/shared-in-session presentation behavior, not a networked community board.
