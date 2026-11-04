# House Rosier — Week 1 Mobile Dialogue & Toast Patch v0.2.4

Scope: presentation-only patch on top of v0.2.3. No Week 1 narrative nodes or post-Day-7 content changed.

## Changes

- Player choices now render inside the main parchment dialogue box beneath a subtle divider.
- Choice buttons retain large mobile tap targets, while the full dialogue card scrolls if a rare choice set exceeds available height.
- The global toast notification moved from the bottom-center reading area to a compact banner below the HUD.
- Memory-fragment acquisition now uses the compact bilingual label `Memory Fragment · 记忆碎片 — <title>`.
- Toasts do not intercept pointer/touch events.

## Regression checks

- Existing `#choices` and `.choice-btn` IDs/classes are preserved, so story choice logic is unchanged.
- `renderChoices()` still hides options immediately after selection and applies effects before advancing.
- Memory collection/state flags are unchanged; only notification presentation and wording changed.
