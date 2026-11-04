# House Rosier — Week 1 Stable v0.4.0

Baseline: v0.3.8 Opening Text Polish.

This release freezes the authored Day 1–7 experience as the current Week 1 stable candidate. No Week 2+ narrative restructuring is included.

## Stability / product fixes

- Identity confirmation now shows the player-facing localized form of address (e.g. `Nait 大人 · Lord Nait`) instead of the internal enum value `lord`.
- Manual save/load slots are now real buttons with keyboard focus, Enter/Space activation, visible focus styling, and ARIA labels.
- Story input is temporarily locked during day-card and background transitions to reduce double-click / stale-background race conditions. Reduced Motion uses a near-instant lock window.
- Main Settings keeps the AI enable toggle and state visible, while Endpoint / API Key / model / debug controls live under a collapsible “高级 AI 设置 / Advanced AI Settings” section.
- Existing Week 1 continuity, half-body sprites, fixed Evelyne letter event, two Memory Fragments, restored Week 1 summary, dialogue feedback behavior, and scroll-header fixes are retained.

## Not included

- No Week 2/3 timeline or main-plot rewrite.
- No new VN convenience features (history / auto-play / read-skip / text-speed) in this stabilization release.
