# House Rosier — Week 1 Continuity & Half-Body Patch v0.2.3

Scope: Week 1 (Day 1–7) only.

## Damien pacing
- Day 5 remains Damien's main political-preparation visit.
- The useful social-rehearsal beat formerly on Day 6 morning is merged into the end of Day 5.
- The Day 6 morning Damien scene is removed from FLOW.
- The closing promise now reads “At the reception…” / “宴会上……” rather than “Tomorrow…”.

## Day 7 Rosecourt continuity
- The garden reception is already at Rosecourt Manor.
- Lucien's closing line now says to return to the main house / 回主楼 rather than “go home / 回家”.

## Half-body sprite presentation
- Elise, Lucien, Alaric, Roderic and Damien now use dedicated half-body derivatives in `assets/char_half/`.
- Sprite rendering no longer constrains wide portraits to the viewport width; shoulders/capes may crop naturally at the sides.
- Per-character scale and vertical framing remain configurable.
- Mobile dialogue returns to the normal bottom safe area because the Netlify badge can be disabled in project settings.

## Save compatibility
- Save version raised to 7.
- Older numeric FLOW positions are realigned by scene/day state.
- Saves paused inside the removed `d6_reception` scene resume at the first remaining Day 6 scene.
