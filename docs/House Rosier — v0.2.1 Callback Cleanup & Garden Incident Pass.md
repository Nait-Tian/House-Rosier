# House Rosier — v0.2.1 Callback Cleanup & Garden Incident Pass

## Changes

### Callback semantics

- `flag` now represents facts / one-off state only.
- `tag` now represents repeatable behavioral patterns.
- New authored Week1 behavior effects were migrated from behavior-shaped flags to tags.
- Branches that formerly checked behavior flags now read `traitGte`.
- Legacy save migration remains: old boolean behavior flags are converted to one structured trait count only when no trait count already exists.

### Narrative source cleanup

- Removed overridden duplicate `SCENES.*` definitions from `data.js`, preserving only the final effective scene for each id.
- Renamed the misleading active `d4_roderic` scene to `d4_political_map` and updated FLOW references.

### Day7 Mira / Bellacourt incident

The incident now provides more information before the player chooses:

- Bellacourt's gown is clearly costly and difficult to replace.
- Mira visibly strikes her wrist and may be hurt.
- A nearby young noble may have contributed to the fall, but this is not proven.
- A witness thinks Mira caught on something, but is uncertain.
- Elise notices Mira's wrist and deliberately waits for Nait to act.
- The cause remains ambiguous: accident, carelessness, or deliberate interference.

The intent is to make the four responses genuine priority choices rather than four polished answers to a thin event.

## Design rule

Past choices shape interpretation. Current choices remain free.
