House Rosier — Web Build

This is a static web build of the current game package.

Local use:
1. Open index.html in a modern browser.
2. For the most reliable API/network behavior, run a simple local web server instead of file://.

Example with Python installed:
  python -m http.server 8000
Then open:
  http://localhost:8000

Deployment:
Upload the CONTENTS of this folder to any static host such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, or similar.

Notes:
- Main sprites, Q-version chat avatars, and optimized bond portraits are included.
- AI chat still requires the player to configure a compatible API endpoint/key in the game's settings.
- This build is static HTML/CSS/JS and does not include a backend proxy.

Kimi K3 compatibility fix: temperature=1, max_completion_tokens>=4096, reasoning_effort=low, longer timeout, empty-response diagnostics.

=== Week 2–3 Playtest Expansion ===
- Playable through Day 21.
- Title screen includes “直接试玩第二、三周” quick start.
- Week 2 unlocks the Royal City on Day 10.
- Week 3 unlocks the Outskirts on Day 15.
- Day 21 announces Week 4 full-map free travel.
- Added Map HUD panel with progressive region unlocks.
- Added hidden five-route tendency tracking: Family / Alaric / Roderic / Damien / Ensemble. No route is locked during Weeks 1–3.
- Added introductory Rosier Estate stewardship stats and first real governance choice.
- Added early identity-stance choice without fixing the objective truth.
- Current Royal City / Outskirts scene backgrounds reuse the existing art set as prototype placeholders; dedicated regional background art can be added later without changing the route logic.

Week 2–3 interaction pass: key route/free-time events now use multi-round character dialogue and follow-up choices instead of one-shot summaries.


Dialogue density pass: multi-character events now contain longer cross-character exchanges between 2–3 player choice beats; major group/mystery scenes are intentionally longer than ordinary daily scenes.


2026-09-10 loading/mobile fix: initial scene background and character sprites are preloaded before gameplay; Week 2 prototype no longer starts on black; mobile HUD uses one five-button row beneath date/location; dialogue and sprite sizing adjusted for phone viewports.


P0/P1 coherence pass (2026-09-10)
- P0 gender canon remains player-selected and saved per slot; AI prompts receive current pronouns.
- P0 boot/background/portrait preload and mobile HUD fixes retained.
- P1 AI remains non-canonical; output is validated before display and escaped before HTML rendering.
- P1 optional-chat memories are typed as player_statement records; NPC improvisation is not promoted to canon.
- P1 API keys are session-only by default; persistent storage is explicit opt-in; Forget API Key clears both.
- P1 debug export contains only keySet/rememberKey booleans, never raw secrets.
- P1 save schema v3 stores scene/node and restores exact authored position, reducing state drift/repeated scenes.
- P1 Status explicitly reports observable state/NPC disposition and does not author Nait's feelings.
