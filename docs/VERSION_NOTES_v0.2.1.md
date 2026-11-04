# House Rosier v0.2.1 — Package Notes

This package is based on `House-Rosier-v0.2.0-Week1-Stable`.

Added:

- `House Rosier — Week1 Narrative Expansion Bible v0.2.1.md`
- Documentation folder for narrative/system design files.

The playable game code itself is unchanged from the v0.2.0 stable baseline in this package. The new Week 1 expansion document is a design source for the next implementation pass.


## Day1–3 playable implementation

Implemented in game data:

- Elise recognition opening;
- early behavior/callback flags;
- recovery and family-response tags;
- Rosier heir rumor escalation;
- Rosecourt Spring Garden Party setup;
- Alaric boundary-choice rebalance;
- Day3 riding-crop/body-memory choice.

Day7 Garden Party callback logic is intentionally not yet implemented; these new flags are the foundation for that next narrative pass.

## Day4–6 playable expansion

- Reframed Day4 around public rumors of the Rosier heir's possible death and succession instability.
- Established the Spring Garden Party as a traditional flower-viewing event with an obvious political purpose.
- Added ally / neutral / political-opponent preparation logic.
- Expanded Lucien + Elise family preparation while keeping identity stance separate from family loyalty.
- Added Damien guest-list and rehearsal scenes with separate political/personal trust seeds.
- Added Alaric pre-party identity-method scene with callbacks to Day3 honesty, evidence, and boundary choices.
- Added Roderic horse interaction with callbacks to recovery and body-memory choices.
- Added Day6 Elise night scene before the public event.
- Day1–3 flags now begin producing visible callbacks before Day7.


## Day7 Spring Garden Party implementation

- Replaced the placeholder Day7 identity choice with the full Spring Garden Party climax.
- Added three escalating social tests, two player-initiated relationship moments, and dynamic Week1 callbacks.
- Added repeatable callback trait storage and threshold-capable branch rules.
- Added parallel first-stirring checks for Damien, Alaric, and Roderic plus a family-belonging equivalent.
- Identity stance is no longer chosen or locked on Day7.
