# House Rosier — Week 1 Memory Summary Fix v0.2.5

Scope: Week 1 memory-fragment continuity only, on top of v0.2.4.

## Fix
- The current Week 1 authored flow only awards one actual memory fragment: `Evelyne's Letter` (`frag_letter`).
- Retired fragment definitions `The Old Bracer` and `Dream of the Rainy Night` were removed from the active fragment catalogue.
- Status / Week 1 completion memory totals now therefore use a denominator of 1 rather than 3.
- If the player found Evelyne's letter, the memory count is `1 / 1`; if they chose another Day 2 evening route, it remains `0 / 1`.

## Save migration
- Save version raised from v7 to v8.
- Legacy saves are sanitized on load so retired fragment IDs cannot remain as ghost entries or break the Memory screen.

No Day 1–7 scene text, romance values, choice outcomes, or post-Day-7 narrative content was changed.
