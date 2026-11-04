# House Rosier

Fantasy romance visual novel project set in Rosecourt Manor.

**Play online:** https://houserosier.netlify.app/

## Version

**v0.6.1 — Backlog, Loading Screen & Performance Build**

## Included

- Weeks 1–3 interactive story (bilingual EN / CN)
- Day Card system and weekly summaries
- Character portrait and background system
- Dialogue backlog (文本回顾), chibi loading screen
- Relationship / route / identity tracking
- Mobile-oriented layout

## Project Structure

- `index.html` — game entry
- `css/` — styles
- `js/` — game logic (`game.js`, `ai.js`) and story data (`data.js`)
- `assets/` — images and resources
- `docs/` — narrative design bibles and patch notes

## Notes

Player-selected gender expression and form of address are saved per slot. All canon text lives in `js/data.js`; the engine only walks those nodes.


## v0.2.1 narrative implementation

- Revised Elise awakening introduction and first-response choice.
- Added structured Week1 callback traits (`tag`) for repeatable behavior, with factual state kept in `flag`.
- Expanded Day2 Rosier succession rumors and introduced the Rosecourt Spring Garden Party.
- Rebalanced Alaric boundary choice so refusal is not an automatic romance penalty.
- Added a Day3 training-ground choice that seeds later Roderic interactions.
- Day7 now consumes Week1 callbacks during the full Spring Garden Party climax.


Current version: v0.2.1 Week1 Narrative Stable Candidate


## Day7 Spring Garden Party

The Week1 climax is now fully playable: ally health concern, hostile memory probe, Bellacourt household accident, dynamic callback reactions, relationship follow-ups, and parallel first-stirring evaluation.


## v0.2.1 cleanup pass

- Separated callback semantics: `tag` = repeatable player behavior, `flag` = factual/one-off state.
- Preserved legacy save migration without double-counting new authored choices.
- Removed overridden duplicate scene definitions from `data.js`.
- Renamed the active Day4 political-map scene for maintainability.
- Expanded the Day7 Mira/Bellacourt incident with injury, witness ambiguity, and incomplete information before the player chooses.


## v0.2.7 Identity Carousel

- Opening identity screen rebuilt as portrait carousel with confirm modal.
- Male: short hair / young master; female: long hair / my lady; nonbinary: existing portrait / lord.

## v0.2.6 Week 1 Rain Memory Restore

- Restores `Rain Among the Roses / 雨中玫瑰` as the second formal Week 1 Memory Fragment.
- Adds a subtle Day 3 library touch trigger before Alaric's scene and a night dream afterward.
- Preserves both wake-up responses: write it down quickly, or stop thinking and go back to sleep.
- Week 1 fragment total is now 2.
- Save schema updated to v9 for the inserted Day 3 scene.


## v0.3.4
- Added stronger sticky header occlusion in long overlays such as Settings, so scrolled content no longer slides visibly behind the title / floating close button.
- Added body scroll locking while overlays are open, improving mobile modal behavior.


## v0.3.5
- Fixed Settings overlay horizontal overflow on desktop and mobile.
- AI action buttons now wrap cleanly; AI status occupies its own line.
- Inputs, labels, and long API/model/debug strings are constrained to the settings sheet width.


## v0.3.6 — Unified Scroll Header Occlusion
- Audited every vertically scrollable overlay: schedule, map, status, memory, menu, settings, talk, saves, and codex.
- Their headers now remain sticky and fully opaque on desktop and mobile, so scrolling content cannot show through behind titles or close buttons.
- Added the same top shield to the scrollable identity-selection page.
- Week 1 summary now scrolls inside its own card with a sticky summary header instead of scrolling the translucent backdrop.


## v0.3.7
- Evelyne’s Letter is now a fixed Day 2 memory event after Lucien’s first scene.
- Day 2 optional Library visit replaced by Rosecourt Conservatory.
- Save schema v11.


## v0.4.0 — Week 1 Stable
Week 1 stabilization release. See `docs/WEEK1_STABLE_v0.4.0.md`.


## v0.4.2
- Identity mobile title is kept on one line.
- Subtitle now breaks before the gender/address-choice sentence.
- Carousel-to-description spacing tightened on phones.


## v0.4.3
- Simplified the identity selection header: removed repeated Nait/Omega background text and retained only the player-facing note that gender expression and form of address are chosen for this save.


## v0.4.6
- Added a dedicated semi-opaque backdrop behind the Week 1 Summary overlay, so the summary no longer appears on a transparent background over the previous scene.
- Reinforced the summary sheet background and shadow for clearer separation on mobile and desktop.


## v0.4.7
- Rebuilt the Week 1 Summary visual treatment as a clean chapter card with a proper backdrop, centered heading, section spacing, and styled summary items.
- Removed malformed legacy summary CSS that had been causing the page to look unstyled and awkward on mobile.


## v0.5.1
- Split the Week 1 Summary continue button into two visual lines: Chinese on the first line and English on the second.
- Reduced mobile choice-button font size and padding so long reply options are more likely to stay on a single line.


## v0.5.6
- Changed Damien’s first identity reveal so Elise quietly identifies him before he begins speaking, avoiding the awkward Damien-nameplate narration beat.


## v0.5.7
- Restored Lucien reaction beats after the Day 5 morning advice choice so the scene no longer jumps directly from the player option to Elise.


## v0.5.8
- Fixed Day 5 Damien entrance sprite handoff: after Elise introduces him, the next Damien dialogue node now explicitly switches the portrait to Damien instead of retaining Elise on screen.


## v0.5.9
- Restyled the Week 1 summary to return to a more atmospheric chapter-end presentation: scenic backdrop, glassmorphism section cards, and a centered “七日之后” header.
- Kept the newer stable summary logic while rolling back the visual tone toward the earlier, prettier version you preferred.


## v0.6.0
- Added a dialogue backlog (文本回顾): every spoken line and the player’s own choices are recorded (up to 240 entries) and can be browsed via the new “LOG 回顾” HUD button; backlog entries persist in saves.
- Added a loading screen with a random chibi protagonist (male / female / non-binary) running along the progress bar, real preload progress for core art, and flavor text.
- Performance: recompressed all artwork (identity portraits 1086×1448→480×640, backgrounds re-encoded at q76), cutting the package from ~12.4 MB to ~6.1 MB; remaining backgrounds now preload during idle time (requestIdleCallback) instead of blocking.
- Fixed the perceived “identity confirm needs two clicks” issue: the confirm handler was always fine, but the old flow closed the modal and then blocked on multi-MB image preloads with no feedback, so the first click looked dead. Starting a game now shows the loading screen immediately, and the compressed assets make the wait short.


## v0.6.1
- Fixed a real start-blocking bug found after deploying v0.6.0: `preloadImage` awaited `img.decode()`, which can hang indefinitely in a hidden/background tab, freezing the loading screen at 0% and making “确定开始” look dead. Decode is now fire-and-forget, and every image preload has a 15 s watchdog so the game can always start.
- Bumped all asset URLs to `?v=0.6.1` — including `data.js`, which was still cache-busted as `?v=0.3.7`, so returning players were silently served the old story text from cache.
