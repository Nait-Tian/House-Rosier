# Roderic Week 1 Continuity Fix v0.2.2

- Restored a dedicated Day 4 first-arrival scene for Roderic, matching the Day 3 foreshadowing that Wycliffe's heir would arrive "tomorrow".
- Day 6 `d6_roderic` is now a follow-up shared-action/horse scene rather than his unexplained first appearance.
- Both scenes guarantee `met_roderic = true`.
- Save schema bumped to v6. Older saves are realigned to FLOW by authored scene id (or day/period/location fallback) so inserting the Day 4 scene does not shift them to the wrong checkpoint.
- Old saves that already completed `d6_roderic` automatically recover the missing `met_roderic` flag.
