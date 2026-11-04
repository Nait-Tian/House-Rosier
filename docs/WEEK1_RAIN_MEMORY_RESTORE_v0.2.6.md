# House Rosier — Week 1 Rain Memory Restore v0.2.6

## Scope

Week 1 only. Based on v0.2.5.

## Changes

- Restored **Rain Among the Roses / 雨中玫瑰** as a formal Memory Fragment.
- Day 3 library arrival now includes Nait brushing fingertips over worn book spines before Alaric's anomaly examination.
- Added a Day 3 night dream after the afternoon schedule: hard rain, white roses, and a faceless figure calling “Quickly” without using Nait's name.
- Preserved two player responses after waking:
  - **匆匆记下来** — records the dream and sets `noted_rain_roses`.
  - **放弃思考，睡回笼觉** — does not create a note.
- Both choices award `frag_rain_roses`; interpretation remains player-controlled and unresolved.
- Week 1 fragment total is now dynamically **2** (`Evelyne's Letter` + `Rain Among the Roses`).
- Save schema bumped to v9 so older Week 1 saves realign safely after the new Day 3 scene insertion.
