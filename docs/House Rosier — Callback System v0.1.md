# House Rosier — Callback System v0.1

## Goal

The callback system lets later scenes remember how the player has behaved without turning early choices into permanent personality locks.

## Data layers

### Flags
One-off facts and event states, for example `kept_letter`, `d7_enemy_reverse`, or `roderic_shared_action`.

### Callback traits
Repeatable behavior patterns stored in `state.callbacks.traits`. Examples include `honest_uncertainty`, `humor_under_pressure`, `independent_reasoning`, `knows_own_limits`, and `responsible_choice`.

Existing Week1 behavior-shaped boolean flags are automatically counted as callback traits when they are applied. Version 4 saves are rehydrated with one count for any existing compatible flag.

### Relationship dimensions
NPC-specific interpretation remains in `state.rel`. Callback traits describe what the player did; relationship dimensions describe how a particular NPC interpreted it.

## Engine effects

`['flag', name, value]` records a one-off state. If the name is a registered callback trait and value is true, it also adds one trait occurrence.

`['tag', name, amount]` directly adds a repeatable callback trait.

## Conditional branches

The narrative engine now supports backward-compatible branch rules plus:

- `traitGte: [trait, minimum]`
- `relGte: [character, field, minimum]`
- `routeGte: [route, minimum]`
- `all: [...]`
- `any: [...]`
- `notFlag: flagName`

This allows consistency callbacks and first-stirring thresholds without exposing scores to the player.

## Narrative rule

Past choices affect how later characters interpret a present action; they do not remove present choices. Consistency, growth, and contradiction can all be meaningful.

Day7 is the first full implementation: earlier recovery, family, Alaric, Damien, Roderic, humor, evidence, and responsibility choices can produce altered dialogue or NPC reactions during the Spring Garden Party.
