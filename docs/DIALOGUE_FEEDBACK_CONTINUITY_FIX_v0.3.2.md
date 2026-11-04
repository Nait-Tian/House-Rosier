# Dialogue Feedback & Day 1 Continuity Fix v0.3.2

## Changes
- Removed the legacy capsule/pill treatment from post-choice feedback.
- Feedback now appears as plain secondary narration inside the parchment dialogue card, separated only by a short subtle rule.
- Hid the English duplicate inside the feedback aftertext to reduce visual clutter on mobile.
- Fixed Day 1 Elise branch continuity: if the player chooses “……Elise？”, Elise no longer immediately re-introduces her own name in the next beat. A dedicated branch now acknowledges that the player remembered her name, then explains that she is Nait's personal maid and has served them since age fourteen.
- Added cache-busting query strings to CSS and core JS includes so Netlify/mobile Safari is less likely to keep the previous pill styling after deployment.

No route values, flags, or later story flow were changed.
