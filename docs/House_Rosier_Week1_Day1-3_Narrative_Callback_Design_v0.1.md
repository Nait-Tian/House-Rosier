# House Rosier — Week1 Day1–3 Narrative & Callback Design v0.1

## Purpose

This document consolidates the current design direction for the first three days of Week 1.

The goal is not to rewrite the entire opening from scratch, but to:

- preserve the strongest existing Day1–3 material;
- improve the emotional flow of the opening;
- redefine early choices as reusable behavior / relationship signals;
- make earlier choices echo during the Day7 Spring Garden Party;
- keep identity stance, family affinity, and romance affinity separate.

Core design rule:

> Earlier choices should influence how later characters interpret the player, without permanently locking the player into one personality.

---

# 1. Day 1 — Awakening

## Core Theme

**How do I face a life that feels unfamiliar?**

Day 1 should establish:

- Nait has awakened after nearly two months in a coma;
- memory loss is real and immediate;
- Elise is the first emotional anchor;
- the player’s first response style begins forming a pattern;
- old-Nait memories remain unresolved clues, never proof of identity.

---

# 2. Revised Opening with Elise

The current opening should be adjusted so Elise does not introduce herself too abruptly.

The scene should first acknowledge that Elise hoped Nait might still recognize her.

Suggested structure:

> Elise stared at you for a moment, as though waiting for something.
>
> “Do you... still know who I am?”
>
> The question had barely left her lips before she shook her head.
>
> “No. Never mind. You’ve only just woken up.”
>
> She took a quiet breath and looked back at you.
>
> “I’m Elise Marlowe. Your personal maid. I’ve been with you for several years.”
>
> A faint, uncertain smile touched her face.
>
> “You don’t need to remember me yet.”

### Narrative Purpose

This does several things at once:

- establishes Elise as someone emotionally close to old Nait;
- shows that she hoped to be recognized;
- avoids making that hope into pressure;
- begins the larger Week1 theme:
  **people remember the old Nait, but must learn to meet the current one.**

The word **“yet”** is important.

It suggests that Elise still hopes memory may return, without demanding it.

---

# 3. First Player Choice — Response to Elise

The first meaningful choice should answer:

> How does the player respond to someone who clearly expected to be remembered?

## Choice A — Implicit Recognition

> “...Elise?”

Possible effect:

- `implicit_memory_elise = true`
- `unresolved_clue_elise_name = true`

Important:

This must **not** prove that the player is the original Nait.

It is only an unresolved clue:

- body memory;
- subconscious recognition;
- magical residue;
- coincidence;
- or something else.

Elise reaction:

> “Yes.”
>
> Her answer comes too quickly.
>
> “Yes, that’s right.”

She is visibly affected, but does not force an interpretation.

---

## Choice B — Honest Uncertainty

> “I’m sorry. I don’t know you.”

Suggested tags:

- `honest_uncertainty +1`
- `direct_communication +1`

Elise reaction:

> “You don’t need to apologize.”
>
> “Knowing that is enough for now.”

Purpose:

This makes honesty a valid and attractive response, not a failure state.

---

## Choice C — Humor Under Pressure

> “I was hoping you were about to tell me.”

Suggested tags:

- `humor_under_pressure +1`
- `social_ease +1`

Elise reaction:

> She blinks, then lets out the smallest breath of laughter.
>
> “Then at least your sense of timing survived.”

Purpose:

Establishes that humor can be part of Nait’s current personality.

This may later echo at the Garden Party.

---

# 4. Day 1 — Secondary Choice

After Elise introduces herself and explains the immediate situation, the player can move into a more direct question:

> “What happened to me?”

This should be separate from the first personality response.

Later in the day, the player may decide whether to ask about the old Nait.

## Ask About the Past

Possible tag:

- `curiosity_about_past +1`

Possible content:

Elise describes old Nait as:

- proud;
- sharp-tongued;
- protective of people considered “his”;
- difficult, but not uniformly cruel.

Existing example worth preserving:

> Old Nait once stayed with a feverish kitchen apprentice through the night.

This becomes an important Day7 callback seed.

---

## Focus on Recovery Instead

Possible tags:

- `present_focus +1`
- `accepts_recovery +1`

Purpose:

Choosing not to ask about the past should not be treated as “missing content” or as anti-identity behavior.

The player may simply be exhausted.

---

# 5. Day 1 — Day7 Callback Opportunities

Possible callbacks during the Spring Garden Party:

### If `implicit_memory_elise`

Elise may react more strongly when the player later shows another unexplained familiarity.

### If `humor_under_pressure`

During the ally’s health concern, Elise may already expect the player to joke.

### If `honest_uncertainty`

A later admission of memory loss can read as consistency rather than weakness.

### If `curiosity_about_past`

When the servant accident occurs, Elise can connect the player’s behavior with the story she told about old Nait protecting household staff.

### If `present_focus`

Elise may notice that the player has consistently chosen to deal with the present instead of chasing memory.

---

# 6. Day 2 — Recovery, Lucien, and Agency

## Core Theme

**How do I accept care, responsibility, and the existence of a family I do not remember?**

Day 2 should begin connecting personal recovery with political consequences.

---

# 7. Physical Recovery Choice

The existing walking choice is strong and should be preserved.

## Push Too Far

Possible tags:

- `stubborn_walk = true`
- `pushes_limits +1`

This should not automatically be “bad.”

It tells the game something about the player.

Later characters may interpret it differently.

---

## Follow Medical Advice

Possible tags:

- `knows_own_limits +1`
- `accepts_help +1`

This should be particularly meaningful for Roderic later.

Roderic should respect practical self-awareness.

Important principle:

> Roderic likes courage, not stupidity.

A player who says “my hands are shaking, so I’m stopping” may gain respect.

---

# 8. Lucien Conversation

Lucien’s line should remain a core family-route statement:

> “You are my child first, and Rosier’s heir second.”

This creates an important contrast with the outside world.

The court asks:

> Can you still inherit?

Lucien’s first concern is:

> Are you alive, safe, and still here?

---

## Choice A — Honest Emotional Uncertainty

> “I don’t feel anything yet. But I hope I will.”

Suggested tags:

- `honest_vulnerability +1`
- `family_openness +1`

---

## Choice B — Ask About the Old Nait

> “What was I like before?”

Suggested tags:

- `curiosity_about_past +1`
- `family_history_interest +1`

---

## Choice C — Stay Silent but Present

The player does not answer, but does not leave or shut Lucien out.

Suggested tags:

- `guarded_but_present +1`
- `family_distance +1` (soft, not hostile)

Important:

This should not be treated as rejection.

It means:

> I cannot answer you yet, but I am still here.

---

# 9. Political Seed — Rumors Around the Heir

Day 2 should more clearly establish that the coma has political consequences.

Current material already supports this direction.

Lucien can explain that:

- Rosecourt issued only limited public statements;
- the court has begun asking increasingly specific questions;
- some nobles are unusually concerned;
- some opponents have started testing Rosier influence;
- whispers about succession have begun.

The player should understand by Day 2:

> Their awakening is not only a private family event.

This prepares the Day7 Spring Garden Party naturally.

---

# 10. Day 2 Evening Exploration

## Library

Possible discoveries:

- Evelyne’s letter;
- old family material;
- private traces of the former Nait.

Possible flags:

- `letter_seen`
- `kept_letter`
- `family_memory_interest`

Day7 callback:

If the player kept Evelyne’s letter, narration may mention that it is still in their pocket or room before the Garden Party.

---

## Garden

Possible discoveries:

- the white roses;
- Evelyne’s connection to them;
- old Nait’s possessive protectiveness toward the household and estate.

Possible tags:

- `rose_garden_memory`
- `old_nait_protectiveness_known`

Day7 callback:

The Garden Party takes place among the same white roses, giving the location emotional continuity.

---

## Rest

Possible tags:

- `prioritized_recovery +1`
- `health_bonus`

Important:

Rest must not feel like the “boring option.”

It should produce real consequences:

- slightly better stamina;
- different physical narration;
- less visible fatigue during the Garden Party.

---

# 11. Day 3 — Alaric and the Unknown

## Core Theme

**How do I respond to uncertainty, evidence, and the old Nait’s reputation?**

This is the first day where a romance lead can begin forming a meaningful impression.

---

# 12. Alaric’s First Major Choice

The current structure should be revised so every valid response reflects a different attractive quality.

## Choice A — Tell the Truth

> “I don’t remember.”

Suggested effects:

- `alaric_trust +2`
- `alaric_curiosity +1`
- `honest_uncertainty +1`
- `told_alaric_truth = true`

Alaric likes that the player does not fabricate certainty.

---

## Choice B — Ask to See the Evidence

> “Before you examine me, show me what you think the magic left behind.”

Suggested effects:

- `alaric_respect +1`
- `alaric_curiosity +2`
- `independent_reasoning +1`

This signals:

> Do not ask me to believe your conclusion before I see the basis for it.

---

## Choice C — Set a Boundary

> “Not yet. My mind is still my own.”

Old implementation may have treated refusal as loss of trust.

Updated design:

- no automatic trust penalty;
- `alaric_respect +1`
- `asserts_boundary +1`

Alaric should understand boundaries.

Possible Alaric response:

> “Privacy is also data.”
>
> “It tells me where the boundary is.”

Purpose:

Rejecting an interaction is not a romance failure.

---

# 13. Old Nait’s Material Retaliation

If the player learns that old Nait once blocked Alaric’s rare-material suppliers after a personal dispute, the response should remain morally open.

## Immediately Undo It

Possible tags:

- `repair_old_damage +1`
- `accountability_action +1`

Alaric may gain respect.

---

## Investigate Before Acting

Possible tags:

- `deliberate_accountability +1`
- `evidence_first +1`

Important:

This is also valid.

The player may reason:

> I do not know why the order happened. I should not reverse a political decision just to prove I am nicer than my past self.

This may appeal to both Alaric and Damien later.

---

# 14. Day 3 Training-Ground Seed

The training-ground branch should receive one small player choice so it can contribute to later callbacks.

Possible scene:

Nait finds an old riding crop or familiar piece of equipment.

## Option A — Test Body Memory

> Try holding it the way the body seems to expect.

Tags:

- `tests_body_memory +1`
- `unresolved_body_memory_clue +1`

---

## Option B — Ask About Old Skill

> Ask the stablemaster how Nait used to ride.

Tags:

- `curiosity_about_old_skill +1`

---

## Option C — Put It Back

> “Not until my body is ready.”

Tags:

- `knows_own_limits +1`
- `prioritized_recovery +1`

This becomes an early Roderic-compatible seed even before Roderic appears.

---

# 15. Day1–3 Behavior Tag Summary

Suggested hidden tags:

- `honest_uncertainty`
- `direct_communication`
- `humor_under_pressure`
- `curiosity_about_past`
- `present_focus`
- `accepts_recovery`
- `knows_own_limits`
- `pushes_limits`
- `honest_vulnerability`
- `guarded_but_present`
- `family_openness`
- `family_distance`
- `independent_reasoning`
- `asserts_boundary`
- `repair_old_damage`
- `deliberate_accountability`
- `tests_body_memory`
- `accepts_help`

These should not be treated as fixed personality classes.

They are evidence of behavior.

---

# 16. Callback Rule for Day7

The Spring Garden Party should read earlier choices in three ways:

## Consistency

The player behaves similarly to earlier choices.

Example:

A player who repeatedly used humor under pressure jokes during the ally’s health question.

NPC reaction:

> This feels like an established trait.

---

## Growth

The player changes.

Example:

A player who kept emotional distance from Lucien chooses to publicly protect Rosier staff.

NPC reaction:

> Lucien is surprised because this is new.

---

## Contradiction

The player acts against their earlier pattern.

This should not be punished automatically.

It can create a character moment.

Possible Alaric reaction:

> “You said something different three days ago.”

Player:

> “I changed my mind.”

This may itself be attractive.

---

# 17. Day7 Callback Mapping

| Earlier Choice Area | Day7 Event Most Likely to Echo It |
|---|---|
| Humor / honesty after waking | Ally asks about health |
| Recovery / pushing limits | Ally asks about physical condition |
| Lucien family interaction | Public Rosier pressure |
| Interest in old Nait | Memory probe |
| Alaric honesty / evidence / boundary | Political enemy probes memory |
| Old-Nait accountability choice | Servant accident investigation |
| Elise / household kindness | Servant accident |
| Rest / recovery discipline | Physical stamina during the event |
| White rose / Evelyne exploration | Garden Party environment |
| Training-ground body-memory choice | Later Roderic interaction |

---

# 18. Week1 Design Principle

By Day7, the player should feel:

> The game remembers how I have been playing Nait.

Target:

The Garden Party should contain approximately **5–8 recognizable callbacks** from Days1–6.

Not all callbacks need to alter the plot.

They may be:

- changed dialogue;
- a glance;
- a character remembering a previous statement;
- altered narration;
- a special option;
- a subtle relationship reaction.

The goal is continuity, not branching explosion.

---

# 19. Final Principle

Earlier choices should shape interpretation, not restrict future freedom.

A player who was distant can become warm.

A player who was cautious can become bold.

A player who joked can become serious.

Characters should notice these changes.

That is part of the attraction.

> House Rosier should remember not only what the player chose, but how the player changed.
